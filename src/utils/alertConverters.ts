import { 
  Alert, 
  AlertSeverity, 
  AlertCategory, 
  AlertStatus, 
  ThirdPartyAlert,
  PrometheusAlert,
  NagiosAlert,
  ElasticsearchAlert,
  CloudwatchAlert,
  OpsgenieAlert
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// Default conversion options
export interface AlertConversionOptions {
  targetModuleId: string;
  defaultCategory?: AlertCategory;
  defaultSeverity?: AlertSeverity;
  generateId?: boolean;
  includeSourceAsMetadata?: boolean;
  tagPrefix?: string;
}

const defaultOptions: AlertConversionOptions = {
  targetModuleId: 'external',
  defaultCategory: AlertCategory.SYSTEM,
  defaultSeverity: AlertSeverity.INFO,
  generateId: true,
  includeSourceAsMetadata: true,
  tagPrefix: '',
};

/**
 * Converts a Prometheus alert to the internal Alert format
 */
export function convertPrometheusAlert(
  prometheusAlert: PrometheusAlert, 
  options: Partial<AlertConversionOptions> = {}
): Alert {
  const opts = { ...defaultOptions, ...options };
  
  // Map Prometheus severity to our severity
  let severity: AlertSeverity;
  switch (prometheusAlert.severity.toLowerCase()) {
    case 'critical':
      severity = AlertSeverity.CRITICAL;
      break;
    case 'warning':
      severity = AlertSeverity.WARNING;
      break;
    case 'error':
      severity = AlertSeverity.ERROR;
      break;
    case 'info':
      severity = AlertSeverity.INFO;
      break;
    default:
      severity = opts.defaultSeverity!;
  }

  // Map status
  const status = prometheusAlert.status === 'resolved' 
    ? AlertStatus.RESOLVED 
    : AlertStatus.ACTIVE;

  // Convert alert
  return {
    id: opts.generateId ? uuidv4() : (prometheusAlert.alertname + '-' + Date.now()),
    moduleId: opts.targetModuleId,
    title: prometheusAlert.alertname,
    message: prometheusAlert.description || prometheusAlert.summary,
    severity,
    category: inferCategoryFromPrometheus(prometheusAlert),
    status,
    timestamp: new Date(prometheusAlert.startsAt),
    acknowledged: false,
    source: prometheusAlert.source,
    sourceId: prometheusAlert.alertname,
    entity: prometheusAlert.instance ? {
      id: prometheusAlert.instance,
      type: 'instance',
      name: prometheusAlert.instance
    } : undefined,
    tags: prometheusAlert.labels 
      ? Object.entries(prometheusAlert.labels).map(([k, v]) => `${opts.tagPrefix}${k}:${v}`) 
      : undefined,
    metadata: opts.includeSourceAsMetadata 
      ? { 
          original: prometheusAlert,
          job: prometheusAlert.job,
          endsAt: prometheusAlert.endsAt,
        } 
      : undefined,
  };
}

/**
 * Converts a Nagios alert to the internal Alert format
 */
export function convertNagiosAlert(
  nagiosAlert: NagiosAlert, 
  options: Partial<AlertConversionOptions> = {}
): Alert {
  const opts = { ...defaultOptions, ...options };
  
  // Map Nagios state to our severity
  let severity: AlertSeverity;
  switch (nagiosAlert.state) {
    case 'CRITICAL':
      severity = AlertSeverity.CRITICAL;
      break;
    case 'WARNING':
      severity = AlertSeverity.WARNING;
      break;
    case 'UNKNOWN':
      severity = AlertSeverity.ERROR;
      break;
    case 'OK':
      severity = AlertSeverity.INFO;
      break;
    default:
      severity = opts.defaultSeverity!;
  }

  // Convert alert
  return {
    id: opts.generateId ? uuidv4() : `nagios-${nagiosAlert.host_name}-${Date.now()}`,
    moduleId: opts.targetModuleId,
    title: nagiosAlert.service_description || `Host: ${nagiosAlert.host_name}`,
    message: nagiosAlert.output,
    severity,
    category: inferCategoryFromNagios(nagiosAlert),
    status: nagiosAlert.state === 'OK' ? AlertStatus.RESOLVED : AlertStatus.ACTIVE,
    timestamp: new Date(nagiosAlert.timestamp * 1000), // Convert to milliseconds
    acknowledged: false,
    source: nagiosAlert.source,
    sourceId: `${nagiosAlert.host_name}-${nagiosAlert.service_description || 'host-check'}`,
    entity: {
      id: nagiosAlert.host_name,
      type: 'host',
      name: nagiosAlert.host_name
    },
    tags: [
      `host:${nagiosAlert.host_name}`,
      ...(nagiosAlert.service_description ? [`service:${nagiosAlert.service_description}`] : []),
      `state:${nagiosAlert.state}`,
    ],
    metadata: opts.includeSourceAsMetadata 
      ? { 
          original: nagiosAlert,
          longOutput: nagiosAlert.long_output,
          attempt: nagiosAlert.attempt,
          notificationType: nagiosAlert.notification_type
        } 
      : undefined,
  };
}

/**
 * Converts an Elasticsearch alert to the internal Alert format
 */
export function convertElasticsearchAlert(
  esAlert: ElasticsearchAlert, 
  options: Partial<AlertConversionOptions> = {}
): Alert {
  const opts = { ...defaultOptions, ...options };
  
  // Map Elasticsearch severity to our severity
  let severity: AlertSeverity;
  switch (esAlert.severity) {
    case 'critical':
      severity = AlertSeverity.CRITICAL;
      break;
    case 'error':
      severity = AlertSeverity.ERROR;
      break;
    case 'warning':
      severity = AlertSeverity.WARNING;
      break;
    case 'info':
      severity = AlertSeverity.INFO;
      break;
    default:
      severity = opts.defaultSeverity!;
  }

  // Convert alert
  return {
    id: opts.generateId ? uuidv4() : esAlert.id,
    moduleId: opts.targetModuleId,
    title: esAlert.name,
    message: esAlert.message,
    severity,
    category: AlertCategory.DATABASE,
    status: AlertStatus.ACTIVE,
    timestamp: new Date(esAlert.timestamp),
    acknowledged: false,
    source: esAlert.source,
    sourceId: esAlert.id,
    entity: esAlert.cluster ? {
      id: esAlert.cluster,
      type: 'cluster',
      name: esAlert.cluster
    } : undefined,
    tags: [
      ...(esAlert.cluster ? [`cluster:${esAlert.cluster}`] : []),
      ...(esAlert.index ? [`index:${esAlert.index}`] : []),
    ],
    metadata: opts.includeSourceAsMetadata 
      ? { 
          original: esAlert,
          details: esAlert.details,
        } 
      : undefined,
  };
}

/**
 * Converts a CloudWatch alert to the internal Alert format
 */
export function convertCloudwatchAlert(
  cwAlert: CloudwatchAlert, 
  options: Partial<AlertConversionOptions> = {}
): Alert {
  const opts = { ...defaultOptions, ...options };
  
  // Map CloudWatch state to our severity
  let severity: AlertSeverity;
  switch (cwAlert.state) {
    case 'ALARM':
      severity = AlertSeverity.ERROR;
      break;
    case 'INSUFFICIENT_DATA':
      severity = AlertSeverity.WARNING;
      break;
    case 'OK':
      severity = AlertSeverity.INFO;
      break;
    default:
      severity = opts.defaultSeverity!;
  }

  // Convert alert
  return {
    id: opts.generateId ? uuidv4() : `aws-${cwAlert.alarmName}-${Date.now()}`,
    moduleId: opts.targetModuleId,
    title: cwAlert.alarmName,
    message: cwAlert.reason,
    severity,
    category: inferCategoryFromCloudwatch(cwAlert),
    status: cwAlert.state === 'OK' ? AlertStatus.RESOLVED : AlertStatus.ACTIVE,
    timestamp: new Date(cwAlert.timestamp),
    acknowledged: false,
    source: cwAlert.source,
    sourceId: cwAlert.alarmName,
    entity: cwAlert.dimensions && Object.keys(cwAlert.dimensions).length > 0 
      ? {
          id: Object.values(cwAlert.dimensions!)[0],
          type: Object.keys(cwAlert.dimensions!)[0],
          name: Object.values(cwAlert.dimensions!)[0]
        } 
      : undefined,
    tags: [
      `region:${cwAlert.region}`,
      `account:${cwAlert.accountId}`,
      ...(cwAlert.namespace ? [`namespace:${cwAlert.namespace}`] : []),
      ...(cwAlert.metricName ? [`metric:${cwAlert.metricName}`] : []),
      ...cwAlert.resources.map(resource => `resource:${resource}`),
    ],
    metadata: opts.includeSourceAsMetadata 
      ? { 
          original: cwAlert,
          resources: cwAlert.resources,
          dimensions: cwAlert.dimensions,
          namespace: cwAlert.namespace,
          metricName: cwAlert.metricName,
        } 
      : undefined,
  };
}

/**
 * Converts an Opsgenie alert to the internal Alert format
 */
export function convertOpsgenieAlert(
  opsgenieAlert: OpsgenieAlert, 
  options: Partial<AlertConversionOptions> = {}
): Alert {
  const opts = { ...defaultOptions, ...options };
  
  // Map Opsgenie priority to our severity
  let severity: AlertSeverity;
  switch (opsgenieAlert.priority) {
    case 'P1':
      severity = AlertSeverity.CRITICAL;
      break;
    case 'P2':
      severity = AlertSeverity.ERROR;
      break;
    case 'P3':
      severity = AlertSeverity.WARNING;
      break;
    case 'P4':
    case 'P5':
      severity = AlertSeverity.INFO;
      break;
    default:
      severity = opts.defaultSeverity!;
  }

  // Map status
  let status: AlertStatus;
  switch (opsgenieAlert.status) {
    case 'acknowledged':
      status = AlertStatus.ACKNOWLEDGED;
      break;
    case 'closed':
      status = AlertStatus.RESOLVED;
      break;
    default:
      status = AlertStatus.ACTIVE;
  }

  // Convert alert
  return {
    id: opts.generateId ? uuidv4() : opsgenieAlert.id,
    moduleId: opts.targetModuleId,
    title: opsgenieAlert.message,
    message: opsgenieAlert.description || opsgenieAlert.message,
    severity,
    category: inferCategoryFromOpsgenie(opsgenieAlert),
    status,
    timestamp: new Date(opsgenieAlert.createdAt),
    acknowledged: opsgenieAlert.status === 'acknowledged',
    source: opsgenieAlert.source,
    sourceId: opsgenieAlert.id,
    entity: opsgenieAlert.details?.entity ? {
      id: opsgenieAlert.details.entity,
      type: opsgenieAlert.details.entityType || 'unknown',
      name: opsgenieAlert.details.entityName || opsgenieAlert.details.entity
    } : undefined,
    tags: opsgenieAlert.tags,
    metadata: opts.includeSourceAsMetadata 
      ? { 
          original: opsgenieAlert,
          details: opsgenieAlert.details,
          updatedAt: opsgenieAlert.updatedAt
        } 
      : undefined,
  };
}

/**
 * Main conversion function that detects the type of alert and calls the appropriate converter
 */
export function convertAlert(
  thirdPartyAlert: ThirdPartyAlert, 
  options: Partial<AlertConversionOptions> = {}
): Alert {
  switch (thirdPartyAlert.source) {
    case 'prometheus':
      return convertPrometheusAlert(thirdPartyAlert as PrometheusAlert, options);
    case 'nagios':
      return convertNagiosAlert(thirdPartyAlert as NagiosAlert, options);
    case 'elasticsearch':
      return convertElasticsearchAlert(thirdPartyAlert as ElasticsearchAlert, options);
    case 'cloudwatch':
      return convertCloudwatchAlert(thirdPartyAlert as CloudwatchAlert, options);
    case 'opsgenie':
      return convertOpsgenieAlert(thirdPartyAlert as OpsgenieAlert, options);
    default:
      // Safe to use any here as we're just getting the source for the error message
      const unknownAlert = thirdPartyAlert as any;
      throw new Error(`Unsupported alert source: ${unknownAlert.source}`);
  }
}

/**
 * Helper functions to infer the alert category
 */
function inferCategoryFromPrometheus(alert: PrometheusAlert): AlertCategory {
  // Check labels and other properties to infer category
  if (alert.labels) {
    if (alert.labels.security || alert.alertname.toLowerCase().includes('security')) {
      return AlertCategory.SECURITY;
    }
    if (alert.labels.network || alert.instance.includes('network') || alert.job.includes('network')) {
      return AlertCategory.NETWORK;
    }
    if (alert.labels.database || alert.job.includes('database') || alert.job.includes('db')) {
      return AlertCategory.DATABASE;
    }
    if (alert.labels.performance || alert.alertname.toLowerCase().includes('cpu') || 
        alert.alertname.toLowerCase().includes('memory') || alert.alertname.toLowerCase().includes('load')) {
      return AlertCategory.PERFORMANCE;
    }
  }

  // Default to system if we can't infer a more specific category
  return AlertCategory.SYSTEM;
}

function inferCategoryFromNagios(alert: NagiosAlert): AlertCategory {
  const serviceLower = (alert.service_description || '').toLowerCase();
  
  if (serviceLower.includes('security') || serviceLower.includes('firewall') || 
      serviceLower.includes('auth') || serviceLower.includes('permission')) {
    return AlertCategory.SECURITY;
  }
  if (serviceLower.includes('network') || serviceLower.includes('bandwidth') || 
      serviceLower.includes('interface') || serviceLower.includes('ping')) {
    return AlertCategory.NETWORK;
  }
  if (serviceLower.includes('database') || serviceLower.includes('mysql') || 
      serviceLower.includes('postgres') || serviceLower.includes('oracle') || 
      serviceLower.includes('sql')) {
    return AlertCategory.DATABASE;
  }
  if (serviceLower.includes('cpu') || serviceLower.includes('memory') || 
      serviceLower.includes('load') || serviceLower.includes('performance')) {
    return AlertCategory.PERFORMANCE;
  }
  if (serviceLower.includes('app') || serviceLower.includes('service') || 
      serviceLower.includes('process')) {
    return AlertCategory.APPLICATION;
  }

  return AlertCategory.SYSTEM;
}

function inferCategoryFromCloudwatch(alert: CloudwatchAlert): AlertCategory {
  const namespace = (alert.namespace || '').toLowerCase();
  const metricName = (alert.metricName || '').toLowerCase();
  const alarmName = alert.alarmName.toLowerCase();
  
  if (namespace.includes('network') || namespace.includes('vpc') || 
      metricName.includes('network') || alarmName.includes('network')) {
    return AlertCategory.NETWORK;
  }
  if (namespace.includes('rds') || namespace.includes('dynamodb') || 
      namespace.includes('elasticache') || namespace.includes('redshift') ||
      alarmName.includes('database') || alarmName.includes('db')) {
    return AlertCategory.DATABASE;
  }
  if (namespace.includes('lambda') || namespace.includes('ecs') || 
      namespace.includes('eks') || namespace.includes('ec2') ||
      alarmName.includes('application') || alarmName.includes('app')) {
    return AlertCategory.APPLICATION;
  }
  if (metricName.includes('cpu') || metricName.includes('memory') || 
      metricName.includes('latency') || alarmName.includes('performance')) {
    return AlertCategory.PERFORMANCE;
  }
  if (namespace.includes('guardduty') || namespace.includes('securityhub') || 
      alarmName.includes('security')) {
    return AlertCategory.SECURITY;
  }

  return AlertCategory.SYSTEM;
}

function inferCategoryFromOpsgenie(alert: OpsgenieAlert): AlertCategory {
  // Check tags first
  if (alert.tags) {
    for (const tag of alert.tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes('network')) return AlertCategory.NETWORK;
      if (tagLower.includes('security')) return AlertCategory.SECURITY;
      if (tagLower.includes('database') || tagLower.includes('db')) return AlertCategory.DATABASE;
      if (tagLower.includes('performance')) return AlertCategory.PERFORMANCE;
      if (tagLower.includes('application') || tagLower.includes('app')) return AlertCategory.APPLICATION;
    }
  }
  
  // Check the message content
  const messageLower = alert.message.toLowerCase();
  const descriptionLower = (alert.description || '').toLowerCase();
  
  if (messageLower.includes('network') || 
      messageLower.includes('switch') || 
      messageLower.includes('router') ||
      descriptionLower.includes('network')) {
    return AlertCategory.NETWORK;
  }
  
  if (messageLower.includes('security') || 
      messageLower.includes('firewall') ||
      messageLower.includes('breach') ||
      messageLower.includes('hack') ||
      descriptionLower.includes('security')) {
    return AlertCategory.SECURITY;
  }
  
  if (messageLower.includes('database') || 
      messageLower.includes('db') ||
      messageLower.includes('sql') ||
      descriptionLower.includes('database')) {
    return AlertCategory.DATABASE;
  }
  
  if (messageLower.includes('cpu') || 
      messageLower.includes('memory') ||
      messageLower.includes('disk') ||
      messageLower.includes('performance') ||
      messageLower.includes('latency') ||
      descriptionLower.includes('performance')) {
    return AlertCategory.PERFORMANCE;
  }
  
  if (messageLower.includes('application') || 
      messageLower.includes('service') ||
      messageLower.includes('api') ||
      descriptionLower.includes('application')) {
    return AlertCategory.APPLICATION;
  }
  
  // Check details as a last resort
  if (alert.details) {
    const detailsStr = JSON.stringify(alert.details).toLowerCase();
    if (detailsStr.includes('network')) return AlertCategory.NETWORK;
    if (detailsStr.includes('security')) return AlertCategory.SECURITY;
    if (detailsStr.includes('database') || detailsStr.includes('db')) return AlertCategory.DATABASE;
    if (detailsStr.includes('performance')) return AlertCategory.PERFORMANCE;
    if (detailsStr.includes('application') || detailsStr.includes('app')) return AlertCategory.APPLICATION;
  }
  
  return AlertCategory.SYSTEM;
}