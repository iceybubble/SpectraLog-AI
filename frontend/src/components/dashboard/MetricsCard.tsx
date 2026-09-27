import type { CSSProperties, ReactNode } from 'react';
import { Card, Statistic, Row, Col, Typography } from 'antd';
import {
  AlertOutlined,
  FileTextOutlined,
  WarningOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import type { DashboardMetrics } from '@/types';
import { SOC } from '@/theme/socTokens';

const { Text } = Typography;

interface MetricsCardProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
}

interface KpiCardProps {
  title: string;
  value: number | string;
  loading?: boolean;
  prefix?: ReactNode;
  valueColor?: string;
  cardStyle?: CSSProperties;
  subtitle?: string;
}

const KpiCard = ({
  title,
  value,
  loading,
  prefix,
  valueColor = SOC.text,
  cardStyle,
  subtitle,
}: KpiCardProps) => (
  <Card
    loading={loading}
    variant="borderless"
    style={{
      background: SOC.card,
      border: `1px solid ${SOC.border}`,
      borderRadius: SOC.radius,
      height: '100%',
      ...cardStyle,
    }}
    styles={{ body: { padding: '16px 18px' } }}
  >
    <Statistic
      title={<Text style={{ color: SOC.textMuted, fontSize: 12 }}>{title}</Text>}
      value={value}
      prefix={prefix}
      valueStyle={{
        color: valueColor,
        fontSize: 26,
        fontWeight: 700,
        fontFamily: 'inherit',
      }}
    />
    {subtitle ? (
      <Text type="secondary" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
        {subtitle}
      </Text>
    ) : null}
  </Card>
);

export const MetricsCard = ({ metrics, loading }: MetricsCardProps) => {
  const threat = metrics?.threat_score ?? 0;
  const threatPct = `${Math.round(threat * 100)}%`;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={8} xl={8}>
        <KpiCard
          title="Total log volume"
          value={metrics?.total_logs ?? 0}
          loading={loading}
          prefix={<FileTextOutlined style={{ color: SOC.teal, marginRight: 8 }} />}
          valueColor={SOC.teal}
        />
      </Col>
      <Col xs={24} sm={12} lg={8} xl={8}>
        <KpiCard
          title="Active alerts"
          value={metrics?.total_alerts ?? 0}
          loading={loading}
          prefix={<AlertOutlined style={{ color: SOC.blue, marginRight: 8 }} />}
          valueColor={SOC.blue}
        />
      </Col>
      <Col xs={24} sm={12} lg={8} xl={8}>
        <KpiCard
          title="Unassigned critical"
          value={metrics?.critical_alerts ?? 0}
          loading={loading}
          prefix={<WarningOutlined style={{ color: SOC.red, marginRight: 8 }} />}
          valueColor={SOC.red}
          cardStyle={{
            background: SOC.criticalBg,
            borderColor: 'rgba(211, 47, 47, 0.35)',
          }}
          subtitle="Requires immediate triage"
        />
      </Col>
      <Col xs={24} sm={12} lg={8} xl={8}>
        <KpiCard
          title="Open investigations"
          value={metrics?.open_investigations ?? 0}
          loading={loading}
          prefix={<ExperimentOutlined style={{ color: SOC.amber, marginRight: 8 }} />}
          valueColor={SOC.amber}
        />
      </Col>
      <Col xs={24} sm={12} lg={8} xl={8}>
        <KpiCard
          title="Endpoints monitored"
          value={metrics?.devices_monitored ?? 0}
          loading={loading}
          prefix={<SafetyOutlined style={{ color: SOC.purple, marginRight: 8 }} />}
          valueColor={SOC.purple}
        />
      </Col>
      <Col xs={24} sm={12} lg={8} xl={8}>
        <KpiCard
          title="Threat index (model)"
          value={threatPct}
          loading={loading}
          prefix={<DashboardOutlined style={{ color: SOC.green, marginRight: 8 }} />}
          valueColor={SOC.green}
          cardStyle={{
            background: SOC.positiveBg,
            borderColor: 'rgba(139, 195, 74, 0.25)',
          }}
          subtitle="Aggregate risk score"
        />
      </Col>
    </Row>
  );
};
