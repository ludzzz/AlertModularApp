import { useState, useEffect, useCallback } from 'react';
import { Alert, OpsgenieAlert } from '../types';
import { useAlertContext } from '../core/AlertContext';
import { useCoreContext } from '../core/CoreContext';
import { v4 as uuidv4 } from 'uuid';

// Options for the hook
interface ConnectorOptions {
  moduleId: string; // The module ID requesting alerts
  teamId?: string;  // Optional team ID for filtering alerts
  connector?: string; // Optional specific connector to use
  refreshInterval?: number; // How often to refresh alerts in ms
}

// Return type from the hook
interface UseConnectorAlertsResult {
  alerts: Alert[];       // The filtered alerts
  isLoading: boolean;    // Whether we're currently loading alerts
  error: Error | null;   // Any error encountered
  refreshAlerts: () => Promise<void>; // Function to manually refresh alerts
}

/**
 * Custom hook for modules to fetch their team-specific alerts from connected alert sources
 */
export const useConnectorAlerts = ({
  moduleId,
  teamId,
  connector,
  refreshInterval = 60000, // Default refresh interval: 1 minute
}: ConnectorOptions): UseConnectorAlertsResult => {
  const { addThirdPartyAlert, getAlertsByModule } = useAlertContext();
  const { connectors } = useCoreContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Function to fetch alerts from connectors
  const fetchAlerts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would make API calls to the configured connectors
      // For this demo, we'll simulate fetching some Opsgenie alerts
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Find any Opsgenie connectors
      const opsgenieConnectors = connectors.filter(c => 
        c.type === 'opsgenie' && c.enabled
      );
      
      if (opsgenieConnectors.length === 0) {
        // No enabled Opsgenie connectors
        setIsLoading(false);
        return;
      }
      
      // Generate some mock alerts tagged with the specified team
      const mockAlerts = generateMockOpsgenieAlerts(teamId);
      
      // Add the mock alerts to the alert system
      for (const alert of mockAlerts) {
        addThirdPartyAlert(alert, moduleId);
      }
      
    } catch (err) {
      console.error('Error fetching alerts from connector:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [moduleId, teamId, connectors, addThirdPartyAlert]);

  // Set up periodic refresh
  useEffect(() => {
    // Fetch alerts immediately on mount
    fetchAlerts();
    
    // Set up interval for refreshing
    const intervalId = setInterval(fetchAlerts, refreshInterval);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchAlerts, refreshInterval]);

  // Get the current alerts for this module
  const alerts = getAlertsByModule(moduleId);

  return {
    alerts,
    isLoading,
    error,
    refreshAlerts: fetchAlerts,
  };
};

/**
 * Generate mock Opsgenie alerts for testing
 */
function generateMockOpsgenieAlerts(teamId?: string): OpsgenieAlert[] {
  const tags = teamId ? [teamId, 'network', 'generated'] : ['network', 'generated'];
  
  return [
    {
      source: 'opsgenie',
      alertId: uuidv4(),
      id: uuidv4(),
      message: `Network switch failure in ${teamId || 'unknown'} region`,
      description: 'Multiple ports reporting errors on core switch SW-CORE-01',
      priority: 'P2',
      createdAt: new Date().toISOString(),
      status: 'open',
      tags,
      details: {
        affectedDevices: 'SW-CORE-01',
        region: 'US-EAST',
        impact: 'Medium',
        teamId: teamId || 'unknown',
      },
    },
    {
      source: 'opsgenie',
      alertId: uuidv4(),
      id: uuidv4(),
      message: `High latency detected for ${teamId || 'unknown'} application`,
      description: 'Network latency between app server and database exceeding thresholds',
      priority: 'P3',
      createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      status: 'acknowledged',
      tags,
      details: {
        sourceService: 'LatencyMonitor',
        latencyMs: '250ms',
        threshold: '100ms',
        teamId: teamId || 'unknown',
      },
    },
    {
      source: 'opsgenie',
      alertId: uuidv4(),
      id: uuidv4(),
      message: `Firewall rule misconfiguration for ${teamId || 'unknown'} subnet`,
      description: 'Security scan detected potential issue with firewall rules',
      priority: 'P1',
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
      status: 'open',
      tags: [...tags, 'security', 'firewall'],
      details: {
        firewallId: 'FW-EDGE-02',
        ruleId: 'ACL-4592',
        securityImpact: 'High',
        teamId: teamId || 'unknown',
      },
    }
  ];
}