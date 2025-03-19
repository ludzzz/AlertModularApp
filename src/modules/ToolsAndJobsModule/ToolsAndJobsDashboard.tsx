import React, { useState } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { AlertSeverity, AlertCategory } from '../../types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.span<{ status: 'success' | 'running' | 'failed' | 'scheduled' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  background-color: ${({ status }) => {
    switch (status) {
      case 'success':
        return '#e8f5e9';
      case 'running':
        return '#e3f2fd';
      case 'failed':
        return '#ffebee';
      case 'scheduled':
        return '#f3e5f5';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'success':
        return '#2e7d32';
      case 'running':
        return '#1565c0';
      case 'failed':
        return '#c62828';
      case 'scheduled':
        return '#6a1b9a';
      default:
        return '#616161';
    }
  }};
`;

const JobsList = styled.div`
  margin-top: 15px;
`;

const JobItem = styled.div<{status: 'success' | 'running' | 'failed' | 'scheduled'}>`
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ status }) => {
    switch (status) {
      case 'success':
        return '#e8f5e920';
      case 'running':
        return '#e3f2fd20';
      case 'failed':
        return '#ffebee20';
      case 'scheduled':
        return '#f3e5f520';
      default:
        return '#f5f5f5';
    }
  }};
  border-left: 4px solid ${({ status }) => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'running':
        return '#2196f3';
      case 'failed':
        return '#f44336';
      case 'scheduled':
        return '#9c27b0';
      default:
        return '#9e9e9e';
    }
  }};
`;

const JobDetails = styled.div`
  flex: 1;
`;

const JobTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const JobMeta = styled.div`
  font-size: 0.8rem;
  color: #666;
  display: flex;
  gap: 15px;
`;

const ToolsList = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
`;

const ToolItem = styled.div`
  padding: 15px;
  border-radius: 4px;
  background-color: #f5f5f5;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ToolIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const ToolName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const ProgressContainer = styled.div`
  margin-top: 15px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number; color: string }>`
  height: 100%;
  width: ${props => `${props.percent}%`};
  background-color: ${props => props.color};
  transition: width 0.3s ease;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #1976d2;
  }
`;

interface ScheduledJob {
  id: string;
  name: string;
  status: 'success' | 'running' | 'failed' | 'scheduled';
  schedule: string;
  lastRun?: Date;
  nextRun: Date;
  duration?: number;
  type: 'backup' | 'cleanup' | 'report' | 'maintenance';
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: 'monitoring' | 'automation' | 'analysis' | 'administration';
}

const ToolsAndJobsDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();

  // Mock scheduled jobs data
  const [jobs] = useState<ScheduledJob[]>([
    {
      id: 'daily-backup',
      name: 'Daily Database Backup',
      status: 'success',
      schedule: '0 0 * * *', // Every day at midnight
      lastRun: new Date(Date.now() - 8 * 3600000), // 8 hours ago
      nextRun: new Date(Date.now() + 16 * 3600000), // 16 hours from now
      duration: 1250, // seconds
      type: 'backup'
    },
    {
      id: 'log-rotation',
      name: 'Log Rotation',
      status: 'running',
      schedule: '0 */6 * * *', // Every 6 hours
      lastRun: new Date(Date.now() - 20 * 60000), // 20 minutes ago
      nextRun: new Date(Date.now() + 5 * 3600000 + 40 * 60000), // 5 hours and 40 minutes from now
      type: 'maintenance'
    },
    {
      id: 'weekly-report',
      name: 'Weekly Analytics Report',
      status: 'scheduled',
      schedule: '0 9 * * 1', // Every Monday at 9am
      nextRun: new Date(Date.now() + 2 * 24 * 3600000 + 8 * 3600000), // 2 days and 8 hours from now
      type: 'report'
    },
    {
      id: 'db-cleanup',
      name: 'Database Cleanup',
      status: 'failed',
      schedule: '0 1 * * 0', // Every Sunday at 1am
      lastRun: new Date(Date.now() - 12 * 3600000), // 12 hours ago
      nextRun: new Date(Date.now() + 6 * 24 * 3600000 + 13 * 3600000), // 6 days and 13 hours from now
      type: 'cleanup'
    },
    {
      id: 'cache-refresh',
      name: 'Cache Refresh',
      status: 'success',
      schedule: '0 */2 * * *', // Every 2 hours
      lastRun: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      nextRun: new Date(Date.now() + 90 * 60000), // 90 minutes from now
      duration: 45, // seconds
      type: 'maintenance'
    }
  ]);

  // Mock tools data
  const [tools] = useState<Tool[]>([
    { id: 'database-admin', name: 'Database Admin', icon: '🗄️', category: 'administration' },
    { id: 'log-analyzer', name: 'Log Analyzer', icon: '📊', category: 'analysis' },
    { id: 'backup-restore', name: 'Backup & Restore', icon: '💾', category: 'administration' },
    { id: 'system-monitor', name: 'System Monitor', icon: '📈', category: 'monitoring' },
    { id: 'job-scheduler', name: 'Job Scheduler', icon: '⏱️', category: 'automation' },
    { id: 'api-tester', name: 'API Tester', icon: '🔌', category: 'monitoring' },
  ]);

  // Calculate stats
  const jobStats = {
    total: jobs.length,
    success: jobs.filter(j => j.status === 'success').length,
    running: jobs.filter(j => j.status === 'running').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    scheduled: jobs.filter(j => j.status === 'scheduled').length,
    successRate: Math.round(
      (jobs.filter(j => j.status === 'success').length / 
       (jobs.filter(j => j.status === 'success' || j.status === 'failed').length || 1)) * 100
    )
  };

  // Function to generate a test alert
  const generateTestAlert = () => {
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const alertType = job.status === 'failed' ? 'failure' : 
                     job.status === 'running' ? 'long-running' : 
                     Math.random() > 0.5 ? 'completed' : 'scheduled';
    
    switch (alertType) {
      case 'failure':
        addAlert({
          moduleId: 'toolsandjobs',
          title: `Job Failure: ${job.name}`,
          message: `The scheduled job "${job.name}" has failed to complete. Please check the logs for more information.`,
          severity: AlertSeverity.ERROR,
          category: AlertCategory.SYSTEM,
          source: 'job-scheduler',
          entity: {
            id: job.id,
            type: 'scheduled-job',
            name: job.name
          },
          tags: ['job-failure', job.type, 'automation']
        });
        break;
      
      case 'long-running':
        addAlert({
          moduleId: 'toolsandjobs',
          title: `Long-Running Job: ${job.name}`,
          message: `The job "${job.name}" has been running for longer than expected. Current duration: ${Math.floor(Math.random() * 120 + 60)} minutes.`,
          severity: AlertSeverity.WARNING,
          category: AlertCategory.PERFORMANCE,
          source: 'job-monitor',
          entity: {
            id: job.id,
            type: 'scheduled-job',
            name: job.name
          },
          tags: ['long-running', job.type, 'performance']
        });
        break;
      
      case 'completed':
        addAlert({
          moduleId: 'toolsandjobs',
          title: `Job Completed: ${job.name}`,
          message: `The scheduled job "${job.name}" has completed successfully in ${job.duration || Math.floor(Math.random() * 600 + 30)} seconds.`,
          severity: AlertSeverity.INFO,
          category: AlertCategory.SYSTEM,
          source: 'job-scheduler',
          entity: {
            id: job.id,
            type: 'scheduled-job',
            name: job.name
          },
          tags: ['job-completed', job.type, 'automation']
        });
        break;
        
      case 'scheduled':
        addAlert({
          moduleId: 'toolsandjobs',
          title: `Job Scheduled: ${job.name}`,
          message: `The job "${job.name}" has been scheduled to run at ${job.nextRun.toLocaleString()}.`,
          severity: AlertSeverity.INFO,
          category: AlertCategory.SYSTEM,
          source: 'job-scheduler',
          entity: {
            id: job.id,
            type: 'scheduled-job',
            name: job.name
          },
          tags: ['job-scheduled', job.type, 'automation']
        });
        break;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container>
      <Header>Tools & Jobs Dashboard</Header>
      
      <DashboardGrid>
        <Card>
          <CardTitle>Job Stats</CardTitle>
          <StatusContainer>
            <div>
              <StatusBadge status="success">Success: {jobStats.success}</StatusBadge>
              <StatusBadge status="running" style={{ marginLeft: '8px' }}>Running: {jobStats.running}</StatusBadge>
            </div>
            <div>
              <StatusBadge status="failed">Failed: {jobStats.failed}</StatusBadge>
              <StatusBadge status="scheduled" style={{ marginLeft: '8px' }}>Scheduled: {jobStats.scheduled}</StatusBadge>
            </div>
          </StatusContainer>
          <ProgressContainer>
            <ProgressLabel>
              <span>Success Rate</span>
              <span>{jobStats.successRate}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                percent={jobStats.successRate} 
                color={jobStats.successRate < 70 ? '#f44336' : jobStats.successRate < 90 ? '#ff9800' : '#4caf50'}
              />
            </ProgressBar>
          </ProgressContainer>
        </Card>
        
        <Card>
          <CardTitle>Available Tools</CardTitle>
          <ToolsList>
            {tools.map(tool => (
              <ToolItem key={tool.id}>
                <ToolIcon>{tool.icon}</ToolIcon>
                <ToolName>{tool.name}</ToolName>
              </ToolItem>
            ))}
          </ToolsList>
        </Card>
      </DashboardGrid>
      
      <Card>
        <CardTitle>Scheduled Jobs</CardTitle>
        <JobsList>
          {jobs.map(job => (
            <JobItem key={job.id} status={job.status}>
              <JobDetails>
                <JobTitle>{job.name}</JobTitle>
                <JobMeta>
                  <span>Type: {job.type.charAt(0).toUpperCase() + job.type.slice(1)}</span>
                  {job.lastRun && (
                    <span>Last Run: {formatDate(job.lastRun)}</span>
                  )}
                  <span>Next Run: {formatDate(job.nextRun)}</span>
                  {job.duration && (
                    <span>Duration: {formatDuration(job.duration)}</span>
                  )}
                </JobMeta>
              </JobDetails>
              <StatusBadge status={job.status}>
                {job.status === 'success' ? 'Completed' : 
                 job.status === 'running' ? 'Running' : 
                 job.status === 'failed' ? 'Failed' : 'Scheduled'}
              </StatusBadge>
            </JobItem>
          ))}
        </JobsList>
      </Card>
      
      <ButtonsContainer>
        <Button onClick={generateTestAlert}>Generate Test Alert</Button>
      </ButtonsContainer>
    </Container>
  );
};

export default ToolsAndJobsDashboard;