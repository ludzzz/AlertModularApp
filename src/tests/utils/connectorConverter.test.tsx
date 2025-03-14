import { convertOpsgenieAlert } from '../../utils/alertConverters';
import { OpsgenieAlert, AlertSeverity, AlertStatus, AlertCategory } from '../../types';

describe('Opsgenie Alert Converter', () => {
  const testOpsgenieAlert: OpsgenieAlert = {
    source: 'opsgenie',
    id: 'test-opsgenie-id',
    message: 'Network Switch Failure',
    description: 'Critical failure on core network switch',
    priority: 'P2',
    createdAt: '2023-08-10T12:00:00Z',
    status: 'open',
    tags: ['network', 'infrastructure'],
    details: {
      entity: 'network-switch-01',
      entityType: 'device',
      location: 'Data Center A'
    }
  };

  test('converts basic Opsgenie alert correctly', () => {
    const result = convertOpsgenieAlert(testOpsgenieAlert, {
      targetModuleId: 'network',
      generateId: false
    });

    expect(result).toMatchObject({
      id: testOpsgenieAlert.id,
      moduleId: 'network',
      title: testOpsgenieAlert.message,
      message: testOpsgenieAlert.description,
      severity: AlertSeverity.ERROR, // P2 should map to ERROR
      category: AlertCategory.NETWORK,
      status: AlertStatus.ACTIVE,
      acknowledged: false,
      source: 'opsgenie',
      sourceId: testOpsgenieAlert.id,
      tags: testOpsgenieAlert.tags
    });
  });

  test('maps priority levels correctly', () => {
    // Test P1 -> CRITICAL
    let p1Alert = { ...testOpsgenieAlert, priority: 'P1' as const };
    let result = convertOpsgenieAlert(p1Alert, { targetModuleId: 'test' });
    expect(result.severity).toBe(AlertSeverity.CRITICAL);

    // Test P3 -> WARNING
    let p3Alert = { ...testOpsgenieAlert, priority: 'P3' as const };
    result = convertOpsgenieAlert(p3Alert, { targetModuleId: 'test' });
    expect(result.severity).toBe(AlertSeverity.WARNING);

    // Test P4/P5 -> INFO
    let p4Alert = { ...testOpsgenieAlert, priority: 'P4' as const };
    result = convertOpsgenieAlert(p4Alert, { targetModuleId: 'test' });
    expect(result.severity).toBe(AlertSeverity.INFO);
  });

  test('maps status correctly', () => {
    // Test open -> ACTIVE
    let openAlert = { ...testOpsgenieAlert, status: 'open' as const };
    let result = convertOpsgenieAlert(openAlert, { targetModuleId: 'test' });
    expect(result.status).toBe(AlertStatus.ACTIVE);

    // Test acknowledged -> ACKNOWLEDGED
    let ackAlert = { ...testOpsgenieAlert, status: 'acknowledged' as const };
    result = convertOpsgenieAlert(ackAlert, { targetModuleId: 'test' });
    expect(result.status).toBe(AlertStatus.ACKNOWLEDGED);

    // Test closed -> RESOLVED
    let closedAlert = { ...testOpsgenieAlert, status: 'closed' as const };
    result = convertOpsgenieAlert(closedAlert, { targetModuleId: 'test' });
    expect(result.status).toBe(AlertStatus.RESOLVED);
  });

  test('infers category correctly from tags', () => {
    const testCases = [
      { tags: ['network'], expectedCategory: AlertCategory.NETWORK },
      { tags: ['security'], expectedCategory: AlertCategory.SECURITY },
      { tags: ['database'], expectedCategory: AlertCategory.DATABASE },
      { tags: ['performance'], expectedCategory: AlertCategory.PERFORMANCE },
      { tags: ['application'], expectedCategory: AlertCategory.APPLICATION },
    ];

    testCases.forEach(({ tags, expectedCategory }) => {
      // Create an alert with only the test tag and make sure description doesn't include category hints
      const alert = { 
        ...testOpsgenieAlert, 
        tags, 
        message: 'Generic Alert',
        description: 'Non-specific description'
      };
      const result = convertOpsgenieAlert(alert, { targetModuleId: 'test' });
      expect(result.category).toBe(expectedCategory);
    });
  });

  test('infers category from message content when no tag matches', () => {
    // Test each category separately to avoid interference
    
    // Test network category
    let networkAlert = { 
      ...testOpsgenieAlert, 
      tags: [], 
      message: 'Network outage detected',
      description: 'No category hints here'
    };
    let result = convertOpsgenieAlert(networkAlert, { targetModuleId: 'test' });
    expect(result.category).toBe(AlertCategory.NETWORK);
    
    // Test security category
    let securityAlert = { 
      ...testOpsgenieAlert, 
      tags: [], 
      message: 'Security breach detected',
      description: 'No category hints here'
    };
    result = convertOpsgenieAlert(securityAlert, { targetModuleId: 'test' });
    expect(result.category).toBe(AlertCategory.SECURITY);
    
    // Test database category
    let dbAlert = { 
      ...testOpsgenieAlert, 
      tags: [], 
      message: 'Database connection failure',
      description: 'No category hints here'
    };
    result = convertOpsgenieAlert(dbAlert, { targetModuleId: 'test' });
    expect(result.category).toBe(AlertCategory.DATABASE);
    
    // Test performance category
    let perfAlert = { 
      ...testOpsgenieAlert, 
      tags: [], 
      message: 'High CPU usage detected',
      description: 'No category hints here'
    };
    result = convertOpsgenieAlert(perfAlert, { targetModuleId: 'test' });
    expect(result.category).toBe(AlertCategory.PERFORMANCE);
    
    // Test application category
    let appAlert = { 
      ...testOpsgenieAlert, 
      tags: [], 
      message: 'Application service down',
      description: 'No category hints here'
    };
    result = convertOpsgenieAlert(appAlert, { targetModuleId: 'test' });
    expect(result.category).toBe(AlertCategory.APPLICATION);
    
    // Test system (default) category - removing all potential category hints
    let sysAlert = { 
      ...testOpsgenieAlert, 
      tags: [], 
      message: 'Generic alert message',
      description: 'With no specific category indicators',
      details: {} // Remove details that might contain network hints
    };
    result = convertOpsgenieAlert(sysAlert, { 
      targetModuleId: 'test',
      defaultCategory: AlertCategory.SYSTEM // Force default category
    });
    expect(result.category).toBe(AlertCategory.SYSTEM);
  });
});