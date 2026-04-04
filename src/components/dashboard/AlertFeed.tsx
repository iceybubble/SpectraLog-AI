import { Card, Table, Tag, Button, Space, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import type { Alert } from '@/types';
import { SOC } from '@/theme/socTokens';

const { Text } = Typography;

interface AlertFeedProps {
  alerts: Alert[];
  loading: boolean;
}

const severityColors: Record<string, string> = {
  low: SOC.blue,
  medium: SOC.amber,
  high: SOC.orange,
  critical: SOC.red,
};

export const AlertFeed = ({ alerts, loading }: AlertFeedProps) => {
  const navigate = useNavigate();

  const columns: ColumnsType<Alert> = [
    {
      title: 'Alert ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Button type="link" size="small" onClick={() => navigate(`/alerts/${id}`)} style={{ padding: 0 }}>
          {id}
        </Button>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: SOC.text }}>
            {title}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (sev: string) => (
        <Tag
          style={{
            margin: 0,
            border: 'none',
            background: `${severityColors[sev] ?? SOC.textMuted}33`,
            color: severityColors[sev] ?? SOC.text,
          }}
        >
          {sev.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (s: string) => <Tag color="default">{s.replace('_', ' ')}</Tag>,
    },
    {
      title: 'Detected',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (ts: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {format(new Date(ts), 'yyyy-MM-dd HH:mm')}
        </Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          ghost
          icon={<EyeOutlined />}
          onClick={() => navigate(`/alerts/${record.id}`)}
        >
          Open
        </Button>
      ),
    },
  ];

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <Card
      variant="borderless"
      style={{
        background: SOC.card,
        border: `1px solid ${SOC.border}`,
        borderRadius: SOC.radius,
      }}
      title={
        <Space>
          <Text strong style={{ color: SOC.text, fontSize: 15 }}>
            Critical & open alerts
          </Text>
          {criticalCount > 0 ? (
            <Text style={{ color: SOC.red, fontWeight: 700 }}>!! {criticalCount} critical</Text>
          ) : null}
        </Space>
      }
      extra={
        <Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {alerts.length} shown
          </Text>
          <Button type="link" size="small" onClick={() => navigate('/alerts')}>
            View all
          </Button>
        </Space>
      }
    >
      <Table<Alert>
        size="small"
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={alerts}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (t) => `${t} cases`,
          size: 'small',
        }}
        scroll={{ x: 900 }}
      />
    </Card>
  );
};
