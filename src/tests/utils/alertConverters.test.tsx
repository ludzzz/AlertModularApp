import { 
  convertAlert, 
  convertOpsgenieAlert 
} from '../../utils/alertConverters';
import { 
  AlertCategory, 
  AlertSeverity, 
  AlertStatus, 
  OpsgenieAlert 
} from '../../types';

describe('Alert Converters', () => {
  describe('convertOpsgenieAlert', () => {
    const sampleOpsgenieAlert: OpsgenieAlert = {
      source: 'opsgenie',
      id: 'test-alert-123',
      message: 'Network switch failure',
      description: 'Multiple ports reporting errors on core switch',
      priority: 'P2',
      createdAt: '2023-05-15T10:30:00.000Z',
      status: 'open',
      tags: ['network', 'infrastructure', 'switch'],
      details: {
        entity: 'switch-01',
        entityType: 'device',
        entityName: 'Core Switch 01',
        location: 'Data Center 1'
      }
    };
    
    test('converts Opsgenie alert to internal format', () => {
      const result = convertOpsgenieAlert(sampleOpsgenieAlert, {
        targetModuleId: 'network',
        generateId: false
      });
      
      expect(result).toEqual(expect.objectContaining({
        id: sampleOpsgenieAlert.id,
        moduleId: 'network',
        title: sampleOpsgenieAlert.message,
        message: sampleOpsgenieAlert.description,
        severity: AlertSeverity.ERROR,
        category: AlertCategory.NETWORK,
        status: AlertStatus.ACTIVE,
        timestamp: new Date(sampleOpsgenieAlert.createdAt),
        acknowledged: false,
        source: 'opsgenie',
        sourceId: sampleOpsgenieAlert.id,
        entity: {
          id: 'switch-01',
          type: 'device',
          name: 'Core Switch 01'
        },
        tags: sampleOpsgenieAlert.tags
      }));
    });
    
    test('handles different Opsgenie priorities correctly', () => {
      const priorities: { [key: string]: AlertSeverity } = {
        P1: AlertSeverity.CRITICAL,
        P2: AlertSeverity.ERROR,
        P3: AlertSeverity.WARNING,
        P4: AlertSeverity.INFO,
        P5: AlertSeverity.INFO
      };
      
      Object.entries(priorities).forEach(([priority, expectedSeverity]) => {
        const alert = { 
          ...sampleOpsgenieAlert, 
          priority: priority as 'P1' | 'P2' | 'P3' | 'P4' | 'P5'
        };
        const result = convertOpsgenieAlert(alert, { targetModuleId: 'test' });
        expect(result.severity).toBe(expectedSeverity);
      });
    });
    
    test('handles different Opsgenie statuses correctly', () => {
      const statuses: { [key: string]: AlertStatus } = {
        open: AlertStatus.ACTIVE,
        acknowledged: AlertStatus.ACKNOWLEDGED,
        closed: AlertStatus.RESOLVED
      };
      
      Object.entries(statuses).forEach(([status, expectedStatus]) => {
        const alert = { 
          ...sampleOpsgenieAlert, 
          status: status as 'open' | 'acknowledged' | 'closed' 
        };
        const result = convertOpsgenieAlert(alert, { targetModuleId: 'test' });
        expect(result.status).toBe(expectedStatus);
      });
    });
    
    test('detects category from tags', () => {
      const categorizedTags: { [key: string]: AlertCategory } = {
        network: AlertCategory.NETWORK,
        security: AlertCategory.SECURITY,
        database: AlertCategory.DATABASE,
        performance: AlertCategory.PERFORMANCE,
        application: AlertCategory.APPLICATION
      };
      
      Object.entries(categorizedTags).forEach(([tag, expectedCategory]) => {
        const alert = { 
          ...sampleOpsgenieAlert, 
          tags: [tag],
          message: 'Generic alert'  // Remove category hints from message
        };
        const result = convertOpsgenieAlert(alert, { targetModuleId: 'test' });
        expect(result.category).toBe(expectedCategory);
      });
    });
  });
  
  describe('convertAlert', () => {
    test('routes Opsgenie alerts to the correct converter', () => {
      const opsgenieAlert: OpsgenieAlert = {
        source: 'opsgenie',
        id: 'test-opsgenie-123',
        message: 'Test Opsgenie Alert',
        priority: 'P2',
        createdAt: new Date().toISOString(),
        status: 'open'
      };
      
      const result = convertAlert(opsgenieAlert, { targetModuleId: 'test' });
      expect(result.title).toBe('Test Opsgenie Alert');
      expect(result.source).toBe('opsgenie');
    });
  });
});