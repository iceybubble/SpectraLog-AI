import { Typography, Card, Space, Select, DatePicker, Button, Row, Col } from 'antd';
import { FilterOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SOC } from '@/theme/socTokens';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const cardStyle = {
  background: SOC.card,
  border: `1px solid ${SOC.border}`,
  borderRadius: SOC.radius,
};

export const Overview = () => {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text }}>
          <FilterOutlined style={{ marginRight: 10 }} />
          Overview — filters
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Narrow what analysts see before triage. Connect selections to your API query params when the
          backend is ready.
        </Paragraph>
      </div>

      <Card variant="borderless" title={<Text strong style={{ color: SOC.text }}>Global filters</Text>} style={cardStyle}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
              Time range
            </Text>
            <RangePicker showTime style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={8}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
              Severity
            </Text>
            <Select
              mode="multiple"
              allowClear
              placeholder="All severities"
              style={{ width: '100%' }}
              options={[
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
              Source
            </Text>
            <Select
              mode="multiple"
              allowClear
              placeholder="All sources"
              style={{ width: '100%' }}
              options={[
                { value: 'windows', label: 'Windows' },
                { value: 'server', label: 'Server' },
                { value: 'cloud', label: 'Cloud' },
                { value: 'iot', label: 'IoT' },
                { value: 'android', label: 'Android' },
              ]}
            />
          </Col>
        </Row>
        <Space style={{ marginTop: 20 }}>
          <Button type="primary" icon={<FileSearchOutlined />} onClick={() => navigate('/logs')}>
            Apply & open logs
          </Button>
          <Button onClick={() => navigate('/severity')}>Prioritize by severity →</Button>
        </Space>
      </Card>
    </Space>
  );
};
