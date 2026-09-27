import { Typography, Card, List, Tag, Space } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { logsApi } from '@/services/api';
import type { Log } from '@/types';
import { SOC } from '@/theme/socTokens';

const { Title, Paragraph, Text } = Typography;

const sevColor: Record<string, string> = {
  critical: SOC.red,
  error: SOC.orange,
  warning: SOC.amber,
  info: SOC.blue,
};

export const LiveAttacks = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['live-logs'],
    queryFn: () => logsApi.getLogs({ limit: 25, offset: 0 }),
    refetchInterval: 12_000,
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text }}>
          <ThunderboltOutlined style={{ marginRight: 10 }} />
          Live attacks — recent log stream
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Near–real-time view of ingested events (sitemap: Live Attacks → Recent alert). Refreshes every
          12s while this page is open.
        </Paragraph>
      </div>

      <Card
        variant="borderless"
        style={{
          background: SOC.card,
          border: `1px solid ${SOC.border}`,
          borderRadius: SOC.radius,
        }}
      >
        <List<Log>
          loading={isLoading}
          dataSource={data?.items ?? []}
          renderItem={(log) => (
            <List.Item
              style={{ borderColor: SOC.borderSubtle, cursor: 'pointer' }}
              onClick={() => navigate('/logs')}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      marginTop: 6,
                      borderRadius: '50%',
                      background: sevColor[log.severity] ?? SOC.textMuted,
                      boxShadow: `0 0 8px ${sevColor[log.severity] ?? SOC.textMuted}`,
                    }}
                  />
                }
                title={
                  <Space wrap>
                    <Text strong style={{ color: SOC.text }}>
                      {log.event_type}
                    </Text>
                    <Tag>{log.source}</Tag>
                    <Tag
                      style={{
                        border: 'none',
                        color: sevColor[log.severity],
                        background: `${sevColor[log.severity]}22`,
                      }}
                    >
                      {log.severity}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <Text style={{ color: SOC.textSecondary }}>{log.message}</Text>
                    <Space size="middle" wrap>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {format(new Date(log.timestamp), 'PPpp')}
                      </Text>
                      {log.ip_address ? (
                        <Text code style={{ fontSize: 12, color: SOC.teal }}>
                          {log.ip_address}
                        </Text>
                      ) : null}
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};
