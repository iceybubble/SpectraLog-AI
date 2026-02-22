import { Card, Statistic, Row, Col } from 'antd';
import {
  AlertOutlined,
  FileTextOutlined,
  WarningOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import type { DashboardMetrics } from '@/types';

interface MetricsCardProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
}

export const MetricsCard = ({ metrics, loading }: MetricsCardProps) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Total Logs"
            value={metrics?.total_logs || 0}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Total Alerts"
            value={metrics?.total_alerts || 0}
            prefix={<AlertOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Critical Alerts"
            value={metrics?.critical_alerts || 0}
            prefix={<WarningOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Devices Monitored"
            value={metrics?.devices_monitored || 0}
            prefix={<SafetyOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};