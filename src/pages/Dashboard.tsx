import { useEffect, useState } from 'react';
import { Space, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { dashboardApi, alertsApi } from '@/services/api';

export const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: () => alertsApi.getAlerts({ limit: 10, status: 'open' }),
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Dashboard</h1>
      
      <MetricsCard metrics={metrics || null} loading={metricsLoading} />
      
      <AlertFeed 
        alerts={alertsData?.items || []} 
        loading={alertsLoading} 
      />
    </Space>
  );
};