import { Card, Empty, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { TimelineEvent } from '@/types';

interface TimelineChartProps {
  events: TimelineEvent[];
  loading: boolean;
}

export const TimelineChart = ({ events, loading }: TimelineChartProps) => {
  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <Empty description="No timeline events found" />
      </Card>
    );
  }

  // Prepare data for ECharts
  const sources = ['Windows', 'Android', 'Server', 'IoT', 'Cloud'];
  
  const seriesData = events.map((event) => {
    const sourceIndex = sources.indexOf(event.source);
    return {
      name: event.event,
      value: [
        event.timestamp,
        sourceIndex >= 0 ? sourceIndex : 0,
        event.severity,
        event.details || event.event,
      ],
    };
  });

  const option = {
    title: {
      text: 'Attack Timeline Reconstruction',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data.value;
        return `
          <strong>${params.data.name}</strong><br/>
          Time: ${new Date(data[0]).toLocaleString()}<br/>
          Source: ${sources[data[1]]}<br/>
          Severity: ${data[2]}<br/>
          ${data[3] ? `Details: ${data[3]}` : ''}
        `;
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      name: 'Time',
      nameLocation: 'middle',
      nameGap: 30,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      name: 'Source',
      data: sources,
      axisLabel: {
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'scatter',
        data: seriesData,
        symbolSize: (val: any) => {
          // Size based on severity (1-5)
          return Math.max(val[2] * 8, 10);
        },
        itemStyle: {
          color: (params: any) => {
            const severity = params.data.value[2];
            if (severity >= 4) return '#ff4d4f'; // Critical/High - Red
            if (severity >= 3) return '#faad14'; // Medium - Orange
            return '#52c41a'; // Low - Green
          },
          opacity: 0.8,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 100,
        height: 30,
        bottom: 10,
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
  };

  return (
    <Card>
      <ReactECharts 
        option={option} 
        style={{ height: '600px', width: '100%' }} 
        notMerge={true}
        lazyUpdate={true}
      />
    </Card>
  );
};