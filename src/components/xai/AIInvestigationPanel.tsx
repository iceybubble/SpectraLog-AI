import { useState } from 'react';
import { Alert, Button, Card, Checkbox, Input, Space, Tag, Typography } from 'antd';
import { BulbOutlined, RobotOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import type { AIInvestigationResponse } from '@/types';
import { casesApi, xaiApi } from '@/services/api';

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

interface AIInvestigationPanelProps {
  alertId: string;
}

export const AIInvestigationPanel = ({ alertId }: AIInvestigationPanelProps) => {
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [result, setResult] = useState<AIInvestigationResponse | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);

  const investigateMutation = useMutation({
    mutationFn: () =>
      xaiApi.investigateAlert(alertId, {
        question: question.trim() || undefined,
        analyst_notes: notes.trim() || undefined,
        include_recommendations: includeRecommendations,
      }),
    onSuccess: (data) => setResult(data),
  });

  const saveCaseNoteMutation = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error('No AI investigation result to save');

      const caseTitle = `AI Investigation: ${alertId}`;
      const caseDescription = [
        `AI Summary: ${result.summary}`,
        '',
        `AI Reasoning: ${result.reasoning}`,
      ].join('\n');

      const createdCase = await casesApi.createCase({
        title: caseTitle,
        description: caseDescription,
        created_by: 'ai-assistant',
      });

      const noteContent = [
        `Question: ${question || 'N/A'}`,
        `Notes: ${notes || 'N/A'}`,
        '',
        'Recommendations:',
        ...(result.recommendations.length > 0 ? result.recommendations.map((r) => `- ${r}`) : ['- None']),
      ].join('\n');

      await casesApi.addCaseNote(createdCase.case.case_id, {
        content: noteContent,
        created_by: 'ai-assistant',
      });

      return createdCase.case.case_id;
    },
    onSuccess: (newCaseId) => {
      setCaseId(newCaseId);
    },
  });

  return (
    <Card
      title={
        <Space>
          <RobotOutlined />
          <span>AI Investigation Assistant</span>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Text type="secondary">
          Ask the AI layer for a focused investigation summary and recommended next actions.
        </Text>

        <Input
          placeholder="Question for AI (e.g., What should I triage first?)"
          value={question}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setQuestion(e.target.value)}
        />

        <TextArea
          rows={3}
          placeholder="Analyst notes (optional)"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNotes(e.target.value)}
        />

        <Checkbox
          checked={includeRecommendations}
          onChange={(e) => setIncludeRecommendations(e.target.checked)}
        >
          Include recommendations
        </Checkbox>

        <Button type="primary" onClick={() => investigateMutation.mutate()} loading={investigateMutation.isPending}>
          Generate AI investigation
        </Button>

        {investigateMutation.isError ? (
          <Alert
            type="error"
            message="Failed to generate AI investigation"
            description="Please verify backend is running and includes /api/v1/xai/investigate/{alert_id}."
            showIcon
          />
        ) : null}

        {result ? (
          <Card size="small">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space wrap>
                <Tag color="blue">{result.phase}</Tag>
                <Tag color={result.confidence >= 0.8 ? 'red' : 'orange'}>
                  Confidence {(result.confidence * 100).toFixed(1)}%
                </Tag>
                <Tag>{result.source}</Tag>
              </Space>

              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Summary
                </Title>
                <Paragraph style={{ marginBottom: 0 }}>{result.summary}</Paragraph>
              </div>

              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Reasoning
                </Title>
                <Paragraph style={{ marginBottom: 0 }}>{result.reasoning}</Paragraph>
              </div>

              {result.recommendations.length > 0 ? (
                <div>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    Recommended actions
                  </Title>
                  <Space direction="vertical" size={6}>
                    {result.recommendations.map((item) => (
                      <Text key={item}>
                        <BulbOutlined style={{ marginRight: 8 }} />
                        {item}
                      </Text>
                    ))}
                  </Space>
                </div>
              ) : null}

              <Space wrap>
                <Button onClick={() => saveCaseNoteMutation.mutate()} loading={saveCaseNoteMutation.isPending}>
                  Save as case note
                </Button>
                {caseId ? <Tag color="green">Saved to case: {caseId}</Tag> : null}
              </Space>

              {saveCaseNoteMutation.isError ? (
                <Alert
                  type="error"
                  message="Failed to save case note"
                  description="Ensure backend /api/v1/cases endpoints are running and Elasticsearch is reachable."
                  showIcon
                />
              ) : null}
            </Space>
          </Card>
        ) : null}
      </Space>
    </Card>
  );
};
