import { Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { alertsApi } from '@/services/api';

export const Alerts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['alerts-list'],
    queryFn: () => alertsApi.getAlerts({ limit: 50 }),
    refetchInterval: 20000,
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Alerts</h1>
      <AlertFeed alerts={data?.items ?? []} loading={isLoading} />
    </Space>
  );
};
