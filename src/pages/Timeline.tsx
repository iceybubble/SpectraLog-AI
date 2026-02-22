import { useState } from 'react';
import { Space, Card, DatePicker, Button, Select, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { TimelineChart } from '@/components/timeline/TimelineChart';
import { correlationApi } from '@/services/api';
import { format } from 'date-fns';

const { RangePicker } = DatePicker;

export const Timeline = () => {
  const [timeRange, setTimeRange] = useState<[string, string] | null>(null);
  const [source, setSource] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['timeline', timeRange, source],
    queryFn: () => {
      if (!timeRange) return Promise.resolve([]);
      return correlationApi.getTimeline({
        start_time: timeRange[0],
        end_time: timeRange[1],
        source,
      });
    },
    enabled: !!timeRange,
  });

  const handleSearch = () => {
    if (timeRange) {
      refetch();
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Attack Timeline Reconstruction</h1>

      <Card>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setTimeRange([
                    dates[0].toISOString(),
                    dates[1].toISOString(),
                  ]);
                } else {
                  setTimeRange(null);
                }
              }}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Select source (optional)"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setSource(value)}
              options={[
                { label: 'All Sources', value: undefined },
                { label: 'Windows', value: 'windows' },
                { label: 'Android', value: 'android' },
                { label: 'Server', value: 'server' },
                { label: 'IoT', value: 'iot' },
                { label: 'Cloud', value: 'cloud' },
              ]}
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              disabled={!timeRange}
              style={{ width: '100%' }}
            >
              Load Timeline
            </Button>
          </Col>
        </Row>
      </Card>

      <TimelineChart events={data || []} loading={isLoading} />
    </Space>
  );
};