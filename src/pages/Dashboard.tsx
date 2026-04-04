import { Typography, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { SocDashboardChrome } from '@/components/dashboard/SocDashboardChrome';
import { SocDashboardCharts } from '@/components/dashboard/SocDashboardCharts';
import { dashboardApi, alertsApi } from '@/services/api';
import { SOC } from '@/theme/socTokens';

const { Title, Text } = Typography;

export const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
    refetchInterval: 30000,
  });

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: () => alertsApi.getAlerts({ limit: 10, status: 'open' }),
    refetchInterval: 15000,
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text, fontWeight: 600 }}>
          SOC posture
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Operations overview — alerts, investigations, and signal volume
        </Text>
      </div>

      <SocDashboardChrome />

      <MetricsCard metrics={metrics ?? null} loading={metricsLoading} />

      <SocDashboardCharts metrics={metrics ?? null} />

      <AlertFeed alerts={alertsData?.items ?? []} loading={alertsLoading} />
    </Space>
  );
};
