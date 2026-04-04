import { Typography, Table, Tag, Space, Button } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { alertsApi } from '@/services/api';
import type { Alert } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { SOC } from '@/theme/socTokens';

const { Title, Paragraph } = Typography;

const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
const severityColors: Record<string, string> = {
  critical: SOC.red,
  high: SOC.orange,
  medium: SOC.amber,
  low: SOC.teal,
};

export const Severity = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['alerts-prioritize'],
    queryFn: () => alertsApi.getAlerts({ limit: 100 }),
  });

  const rows = [...(data?.items ?? [])].sort(
    (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
  );

  const columns: ColumnsType<Alert> = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      width: 120,
      render: (s: string) => (
        <Tag
          style={{
            border: 'none',
            background: `${severityColors[s] ?? SOC.textMuted}44`,
            color: severityColors[s],
          }}
        >
          {s.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Alert',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
    },
    {
      title: 'Detected',
      dataIndex: 'timestamp',
      width: 170,
      render: (t: string) => format(new Date(t), 'yyyy-MM-dd HH:mm'),
    },
    {
      title: '',
      key: 'a',
      width: 100,
      render: (_, r) => (
        <Button type="link" size="small" onClick={() => navigate(`/alerts/${r.id}`)}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text }}>
          <WarningOutlined style={{ marginRight: 10 }} />
          Severity — prioritize
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Queue ordered critical-first for triage (sitemap: Severity → Prioritize).
        </Paragraph>
      </div>

      <Table<Alert>
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 12, showSizeChanger: true }}
      />
    </Space>
  );
};
