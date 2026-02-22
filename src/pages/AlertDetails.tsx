import { useParams, useNavigate } from 'react-router-dom';
import { Space, Card, Button, Tag, Descriptions, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi, xaiApi, correlationApi } from '@/services/api';
import { XAIExplainer } from '@/components/xai/XAIExplainer';
import { CorrelationGraph } from '@/components/correlation/CorrelationGraph';
import { format } from 'date-fns';

export const AlertDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: alert, isLoading: alertLoading } = useQuery({
    queryKey: ['alert', id],
    queryFn: () => alertsApi.getAlertDetail(id!),
    enabled: !!id,
  });

  const { data: explanation, isLoading: xaiLoading } = useQuery({
    queryKey: ['xai-explanation', id],
    queryFn: () => xaiApi.explainAlert(id!),
    enabled: !!id,
  });

  const { data: correlationGraph, isLoading: graphLoading } = useQuery({
    queryKey: ['correlation-graph', id],
    queryFn: () => correlationApi.getCorrelationGraph(id!),
    enabled: !!id,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: () => alertsApi.acknowledgeAlert(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert', id] });
    },
  });

  const severityColors: Record<string, string> = {
    low: 'blue',
    medium: 'orange',
    high: 'red',
    critical: 'purple',
  };

  const statusColors: Record<string, string> = {
    open: 'red',
    acknowledged: 'orange',
    investigating: 'blue',
    resolved: 'green',
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/alerts')}>
            Back to Alerts
          </Button>
          <h1 style={{ margin: 0 }}>Alert Details</h1>
        </Space>
        {alert?.status === 'open' && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => acknowledgeMutation.mutate()}
            loading={acknowledgeMutation.isPending}
          >
            Acknowledge
          </Button>
        )}
      </div>

      {/* Alert Information */}
      <Card title="Alert Information" loading={alertLoading}>
        {alert && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Alert ID" span={2}>
                {alert.id}
              </Descriptions.Item>
              <Descriptions.Item label="Title" span={2}>
                {alert.title}
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag color={severityColors[alert.severity]}>
                  {alert.severity.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[alert.status]}>
                  {alert.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp" span={2}>
                {format(new Date(alert.timestamp), 'PPpp')}
              </Descriptions.Item>
              <Descriptions.Item label="Source" span={2}>
                {alert.source}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {alert.description}
              </Descriptions.Item>
              {alert.mitre_tactics && alert.mitre_tactics.length > 0 && (
                <Descriptions.Item label="MITRE ATT&CK Tactics" span={2}>
                  <Space wrap>
                    {alert.mitre_tactics.map((tactic) => (
                      <Tag key={tactic} color="volcano">
                        {tactic}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          </>
        )}
      </Card>

      {/* XAI Explanation */}
      <XAIExplainer explanation={explanation || null} loading={xaiLoading} />

      {/* Correlation Graph */}
      <CorrelationGraph data={correlationGraph || null} loading={graphLoading} />
    </Space>
  );
};