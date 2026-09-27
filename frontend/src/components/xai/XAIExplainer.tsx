import { Card, Progress, Space, Typography, Tag, Alert, Spin, Empty } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { XAIExplanation } from '@/types';

const { Text, Title, Paragraph } = Typography;

interface XAIExplainerProps {
  explanation: XAIExplanation | null;
  loading: boolean;
}

export const XAIExplainer = ({ explanation, loading }: XAIExplainerProps) => {
  if (loading) {
    return (
      <Card title="AI Explanation">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!explanation) {
    return (
      <Card title="AI Explanation">
        <Empty description="No explanation available" />
      </Card>
    );
  }

  const getProgressStatus = (impact: number) => {
    if (Math.abs(impact) >= 0.7) return 'exception';
    if (Math.abs(impact) >= 0.4) return 'normal';
    return 'success';
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0.7) return '#ff4d4f';
    if (impact > 0.4) return '#faad14';
    if (impact > 0) return '#1890ff';
    return '#52c41a';
  };

  return (
    <Card 
      title={
        <Space>
          <WarningOutlined style={{ color: '#faad14' }} />
          <span>Why is this suspicious?</span>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Model and Confidence */}
        <Alert
          message={
            <Space direction="vertical" size="small">
              <div>
                <Text strong>Detection Model: </Text>
                <Tag color="blue">{explanation.model}</Tag>
              </div>
              <div>
                <Text strong>Confidence Score: </Text>
                <Tag color={explanation.confidence >= 0.8 ? 'red' : 'orange'}>
                  {(explanation.confidence * 100).toFixed(1)}%
                </Tag>
              </div>
            </Space>
          }
          type="info"
          showIcon
          icon={<CheckCircleOutlined />}
        />

        {/* Reasoning */}
        {explanation.reasoning && (
          <div>
            <Title level={5}>Analysis Summary</Title>
            <Paragraph>{explanation.reasoning}</Paragraph>
          </div>
        )}

        {/* Feature Importance */}
        <div>
          <Title level={5}>Contributing Factors</Title>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {explanation.features
              .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
              .map((feature, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text strong>{feature.name}</Text>
                      <Tag color={getImpactColor(feature.impact)}>
                        Impact: {(Math.abs(feature.impact) * 100).toFixed(0)}%
                      </Tag>
                    </Space>
                    
                    <Progress
                      percent={Math.abs(feature.impact) * 100}
                      status={getProgressStatus(feature.impact)}
                      strokeColor={getImpactColor(feature.impact)}
                      showInfo={false}
                    />
                    
                    <div>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Value: <Text code>{feature.value}</Text>
                      </Text>
                    </div>
                    
                    <Paragraph 
                      type="secondary" 
                      style={{ 
                        fontSize: '13px', 
                        marginBottom: 0,
                        paddingLeft: '12px',
                        borderLeft: '3px solid #f0f0f0'
                      }}
                    >
                      {feature.explanation}
                    </Paragraph>
                  </Space>
                </div>
              ))}
          </Space>
        </div>

        {/* Legend */}
        <Alert
          message="Color Guide"
          description={
            <Space>
              <Tag color="#ff4d4f">High Impact</Tag>
              <Tag color="#faad14">Medium Impact</Tag>
              <Tag color="#1890ff">Low Impact</Tag>
              <Tag color="#52c41a">Normal Behavior</Tag>
            </Space>
          }
          type="warning"
          showIcon={false}
        />
      </Space>
    </Card>
  );
};