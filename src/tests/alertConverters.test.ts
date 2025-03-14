import { 
  convertAlert, 
  convertPrometheusAlert, 
  convertNagiosAlert, 
  convertElasticsearchAlert, 
  convertCloudwatchAlert 
} from '../utils/alertConverters';
import { 
  AlertSeverity, 
  AlertCategory, 
  AlertStatus, 
  PrometheusAlert, 
  NagiosAlert, 
  ElasticsearchAlert, 
  CloudwatchAlert 
} from '../types';

describe('Alert Converters', () => {
  // Mock the uuid generator for predictable test results
  jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid')
  }));

  beforeEach(() => {
    // Reset date for consistent testing
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1647270000000); // March 14, 2022
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('converts Prometheus alert correctly', () => {
    const prometheusAlert: PrometheusAlert = {
      source: 'prometheus',
      alertname: 'HighCPUUsage',
      instance: 'server-1',
      job: 'node',
      severity: 'warning',
      summary: 'High CPU usage detected',
      description: 'Server has high CPU usage: 92%',
      status: 'firing',
      startsAt: '2022-03-14T12:00:00Z',
      labels: {
        environment: 'production',
        cluster: 'main'
      }
    };

    const result = convertPrometheusAlert(prometheusAlert, { targetModuleId: 'server', generateId: false });

    expect(result).toMatchObject({
      id: expect.any(String),
      moduleId: 'server',
      title: 'HighCPUUsage',
      message: 'Server has high CPU usage: 92%',
      severity: AlertSeverity.WARNING,
      status: AlertStatus.ACTIVE,
      source: 'prometheus',
      sourceId: 'HighCPUUsage',
      entity: {
        id: 'server-1',
        type: 'instance',
        name: 'server-1'
      },
      tags: expect.arrayContaining([
        'environment:production', 
        'cluster:main'
      ])
    });

    expect(result.category).toBeDefined();
  });

  test('converts Nagios alert correctly', () => {
    const nagiosAlert: NagiosAlert = {
      source: 'nagios',
      host_name: 'web-server',
      service_description: 'HTTP',
      state: 'CRITICAL',
      output: 'HTTP CRITICAL: Response time 10.5 seconds exceeds 5.0 second threshold',
      timestamp: 1647270000, // in seconds
      attempt: 3,
      notification_type: 'PROBLEM'
    };

    const result = convertNagiosAlert(nagiosAlert, { targetModuleId: 'server', generateId: false });

    expect(result).toMatchObject({
      id: expect.any(String),
      moduleId: 'server',
      title: 'HTTP',
      message: 'HTTP CRITICAL: Response time 10.5 seconds exceeds 5.0 second threshold',
      severity: AlertSeverity.CRITICAL,
      status: AlertStatus.ACTIVE,
      source: 'nagios',
      sourceId: 'web-server-HTTP',
      entity: {
        id: 'web-server',
        type: 'host',
        name: 'web-server'
      },
      tags: expect.arrayContaining([
        'host:web-server', 
        'service:HTTP',
        'state:CRITICAL'
      ])
    });

    expect(result.category).toBeDefined();
  });

  test('converts Elasticsearch alert correctly', () => {
    const esAlert: ElasticsearchAlert = {
      source: 'elasticsearch',
      id: 'es-alert-123',
      name: 'Disk space low',
      severity: 'warning',
      timestamp: '2022-03-14T12:00:00Z',
      message: 'Disk usage exceeds 85%',
      details: {
        usage_percent: 85,
        threshold: 80
      },
      cluster: 'prod-cluster',
      index: 'logs-*'
    };

    const result = convertElasticsearchAlert(esAlert, { targetModuleId: 'database', generateId: false });

    expect(result).toMatchObject({
      id: 'es-alert-123',
      moduleId: 'database',
      title: 'Disk space low',
      message: 'Disk usage exceeds 85%',
      severity: AlertSeverity.WARNING,
      category: AlertCategory.DATABASE,
      status: AlertStatus.ACTIVE,
      source: 'elasticsearch',
      sourceId: 'es-alert-123',
      entity: {
        id: 'prod-cluster',
        type: 'cluster',
        name: 'prod-cluster'
      },
      tags: expect.arrayContaining([
        'cluster:prod-cluster', 
        'index:logs-*'
      ])
    });

    expect(result.metadata).toBeDefined();
  });

  test('converts CloudWatch alert correctly', () => {
    const cwAlert: CloudwatchAlert = {
      source: 'cloudwatch',
      alarmName: 'HighLatency',
      state: 'ALARM',
      reason: 'Threshold Crossed: 3 datapoints were greater than the threshold (100.0)',
      timestamp: '2022-03-14T12:00:00Z',
      region: 'us-west-2',
      accountId: '123456789012',
      resources: ['arn:aws:ec2:us-west-2:123456789012:instance/i-1234567890abcdef0'],
      namespace: 'AWS/EC2',
      metricName: 'Latency'
    };

    const result = convertCloudwatchAlert(cwAlert, { targetModuleId: 'aws', generateId: false });

    expect(result).toMatchObject({
      id: expect.any(String),
      moduleId: 'aws',
      title: 'HighLatency',
      message: 'Threshold Crossed: 3 datapoints were greater than the threshold (100.0)',
      severity: AlertSeverity.ERROR,
      status: AlertStatus.ACTIVE,
      source: 'cloudwatch',
      sourceId: 'HighLatency',
      tags: expect.arrayContaining([
        'region:us-west-2', 
        'account:123456789012',
        'namespace:AWS/EC2',
        'metric:Latency',
        'resource:arn:aws:ec2:us-west-2:123456789012:instance/i-1234567890abcdef0'
      ])
    });

    expect(result.category).toBeDefined();
  });

  test('main convertAlert distinguishes alert types', () => {
    // Just verify that different alert types are routed to the correct converter
    const prometheusAlert: PrometheusAlert = {
      source: 'prometheus',
      alertname: 'test',
      instance: 'test',
      job: 'test',
      severity: 'info',
      summary: 'test',
      description: 'test',
      status: 'firing',
      startsAt: '2022-03-14T12:00:00Z'
    };

    const result = convertAlert(prometheusAlert, { targetModuleId: 'test' });
    
    // Verify it has the correct source and that conversion happened
    expect(result.source).toBe('prometheus');
    expect(result.moduleId).toBe('test');
  });

  test('throws error for unsupported alert source', () => {
    const unknownAlert = {
      source: 'unknown',
      id: 'test-id'
    } as any;

    expect(() => convertAlert(unknownAlert)).toThrow('Unsupported alert source: unknown');
  });
});