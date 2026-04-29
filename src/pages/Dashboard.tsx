import { useMemo, useState } from 'react';
import { Typography, Space, Card } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { SocDashboardChrome, type DashboardTabKey } from '@/components/dashboard/SocDashboardChrome';
import { SocDashboardCharts } from '@/components/dashboard/SocDashboardCharts';
import { dashboardApi, alertsApi } from '@/services/api';
import { SOC } from '@/theme/socTokens';

const { Title, Text } = Typography;

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('overview');

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
    refetchInterval: 30000,
  });

  const tabLayout = useMemo<
    Record<
      DashboardTabKey,
      {
        summary: string;
        showMetrics: boolean;
        showCharts: boolean;
        showAlerts: boolean;
      }
    >
  >(
    () => ({
      overview: {
        summary: 'Broad snapshot with KPIs, trend visuals, and open alert queue.',
        showMetrics: true,
        showCharts: true,
        showAlerts: true,
      },
      main: {
        summary: 'Analyst default workspace with all core widgets visible.',
        showMetrics: true,
        showCharts: true,
        showAlerts: true,
      },
      ops: {
        summary: 'Operations-first view prioritizing triage queue and case workload.',
        showMetrics: true,
        showCharts: false,
        showAlerts: true,
      },
      status: {
        summary: 'Status dashboard focused on backlog, progress, and resolution health.',
        showMetrics: true,
        showCharts: false,
        showAlerts: true,
      },
      customer: {
        summary: 'Communication view for sharing impact and current incident posture.',
        showMetrics: true,
        showCharts: false,
        showAlerts: true,
      },
      sla: {
        summary: 'SLA performance lens focused on timing, overdue risk, and trend charts.',
        showMetrics: true,
        showCharts: true,
        showAlerts: false,
      },
      timers: {
        summary: 'Chart-centric view for time-based patterns and cadence monitoring.',
        showMetrics: false,
        showCharts: true,
        showAlerts: false,
      },
    }),
    [],
  );

  const currentLayout = tabLayout[activeTab];

  const alertView = useMemo<
    Record<
      DashboardTabKey,
      {
        title: string;
        params: { limit: number; status?: string; severity?: string };
      }
    >
  >(
    () => ({
      overview: {
        title: 'Open alert queue',
        params: { limit: 10, status: 'open' },
      },
      main: {
        title: 'Latest analyst alerts',
        params: { limit: 10 },
      },
      ops: {
        title: 'Operations triage (high/critical)',
        params: { limit: 12, severity: 'high', status: 'open' },
      },
      status: {
        title: 'Investigation status board',
        params: { limit: 12, status: 'investigating' },
      },
      customer: {
        title: "Customer-impact open incidents",
        params: { limit: 8, severity: 'critical', status: 'open' },
      },
      sla: {
        title: 'SLA-sensitive incidents',
        params: { limit: 12, status: 'open' },
      },
      timers: {
        title: 'Timer-correlated incidents',
        params: { limit: 8 },
      },
    }),
    [],
  );

  const activeAlertView = alertView[activeTab];

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['recent-alerts', activeTab, activeAlertView.params],
    queryFn: () => alertsApi.getAlerts(activeAlertView.params),
    refetchInterval: 15000,
  });

  const filteredAlerts = useMemo(() => {
    const items = alertsData?.items ?? [];
    const { status, severity } = activeAlertView.params;
    return items.filter((a) => {
      const statusMatch = status ? a.status === status : true;
      const severityMatch = severity
        ? severity === 'high'
          ? a.severity === 'high' || a.severity === 'critical'
          : a.severity === severity
        : true;
      return statusMatch && severityMatch;
    });
  }, [alertsData?.items, activeAlertView.params]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text, fontWeight: 600 }}>
          Security Operations Overview
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Operations overview — alerts, investigations, and signal volume
        </Text>
      </div>

      <SocDashboardChrome activeTab={activeTab} onTabChange={setActiveTab} />

      <Card
        variant="borderless"
        style={{
          background: SOC.card,
          border: `1px solid ${SOC.border}`,
          borderRadius: SOC.radius,
        }}
        styles={{ body: { padding: '10px 14px' } }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          {currentLayout.summary}
        </Text>
      </Card>

      {currentLayout.showMetrics ? <MetricsCard metrics={metrics ?? null} loading={metricsLoading} /> : null}

      {currentLayout.showCharts ? <SocDashboardCharts metrics={metrics ?? null} /> : null}

      {currentLayout.showAlerts ? (
        <AlertFeed
          alerts={filteredAlerts}
          loading={alertsLoading}
          title={activeAlertView.title}
          emptyText={`No alerts for ${activeTab} view.`}
        />
      ) : null}
    </Space>
  );
};
