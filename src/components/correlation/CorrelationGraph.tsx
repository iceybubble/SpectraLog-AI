import { Card, Spin, Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { CorrelationGraph as CorrelationGraphData } from '@/types';

interface CorrelationGraphProps {
  data: CorrelationGraphData | null;  // Changed from CorrelationGraph
  loading: boolean;
}

const nodeTypeColors: Record<string, string> = {
  ip: '#1890ff',
  device: '#52c41a',
  user: '#faad14',
  process: '#722ed1',
  file: '#eb2f96',
};

const nodeTypeIcons: Record<string, string> = {
  ip: 'circle',
  device: 'rect',
  user: 'diamond',
  process: 'triangle',
  file: 'roundRect',
};

export const CorrelationGraph = ({ data, loading }: CorrelationGraphProps) => {
  if (loading) {
    return (
      <Card title="Event Correlation Graph">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || data.nodes.length === 0) {
    return (
      <Card title="Event Correlation Graph">
        <Empty description="No correlation data available" />
      </Card>
    );
  }

  const option = {
    title: {
      text: 'Event Correlation Graph',
      subtext: 'Relationships between IPs, Devices, Users, and Processes',
      left: 'center',
    },
    tooltip: {
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const nodeData = params.data;
          return `
            <div style="padding: 8px;">
              <strong>${nodeData.name}</strong><br/>
              <span style="color: #888;">Type: ${nodeData.type}</span><br/>
              ${
                nodeData.risk_score
                  ? `<span style="color: #f5222d;">Risk Score: ${nodeData.risk_score}</span>`
                  : ''
              }
            </div>
          `;
        } else if (params.dataType === 'edge') {
          const edgeData = params.data;
          return `
            <div style="padding: 8px;">
              <strong>${edgeData.relationship}</strong><br/>
              <span style="color: #888;">${edgeData.source} → ${edgeData.target}</span>
            </div>
          `;
        }
        return '';
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: data.nodes.map((node) => ({
          id: node.id,
          name: node.label,
          type: node.type,
          risk_score: node.risk_score,
          symbolSize: node.risk_score ? node.risk_score * 50 + 20 : 40,
          symbol: nodeTypeIcons[node.type] || 'circle',
          itemStyle: {
            color: nodeTypeColors[node.type] || '#1890ff',
          },
          label: {
            show: true,
            position: 'bottom',
          },
        })),
        edges: data.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          relationship: edge.relationship,
          lineStyle: {
            width: edge.weight ? edge.weight * 3 : 2,
            curveness: 0.2,
          },
        })),
        roam: true,
        force: {
          repulsion: 300,
          edgeLength: 150,
          gravity: 0.1,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5,
          },
        },
      },
    ],
  };

  return (
    <Card>
      <ReactECharts
        option={option}
        style={{ height: '600px' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </Card>
  );
};