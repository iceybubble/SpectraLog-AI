import { Card, List, Tag, Space, Button } from 'antd';
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { Alert } from '@/types';

interface AlertFeedProps {
  alerts: Alert[];
  loading: boolean;
}

const severityColors: Record<string, string> = {
  low: 'blue',
  medium: 'orange',
  high: 'red',
  critical: 'purple',
};

export const AlertFeed = ({ alerts, loading }: AlertFeedProps) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Recent Alerts"
      extra={
        <Button type="link" onClick={() => navigate('/alerts')}>
          View All
        </Button>
      }
    >
      <List
        loading={loading}
        dataSource={alerts}
        renderItem={(alert) => (
          <List.Item
            actions={[
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/alerts/${alert.id}`)}
              >
                Details
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  {alert.title}
                  <Tag color={severityColors[alert.severity]}>
                    {alert.severity.toUpperCase()}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>{alert.description}</div>
                  <Space size="small">
                    <ClockCircleOutlined />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {format(new Date(alert.timestamp), 'PPpp')}
                    </span>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};