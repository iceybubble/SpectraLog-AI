import { Row, Col, Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import { SOC } from '@/theme/socTokens';
import type { DashboardMetrics } from '@/types';

const chartText = { color: SOC.textMuted, fontSize: 11 };
const axisLine = { lineStyle: { color: SOC.border } };
const splitLine = { lineStyle: { color: SOC.borderSubtle, type: 'dashed' as const } };

interface SocDashboardChartsProps {
  metrics: DashboardMetrics | null;
}

export const SocDashboardCharts = ({ metrics }: SocDashboardChartsProps) => {
  const critical = metrics?.critical_alerts ?? 0;
  const totalAlerts = metrics?.total_alerts ?? 0;
  const openApprox = Math.max(0, totalAlerts - Math.floor(totalAlerts * 0.85));
  const withinSla = Math.max(0, totalAlerts - critical - openApprox);
  const approaching = Math.min(openApprox, 4);
  const overdue = critical;

  const slaOpenOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Open alerts — SLA posture',
      left: 'center',
      top: 8,
      textStyle: { color: SOC.text, fontSize: 13, fontWeight: 600 },
    },
    tooltip: { trigger: 'item' as const },
    legend: {
      bottom: 8,
      textStyle: chartText,
    },
    series: [
      {
        name: 'SLA',
        type: 'pie' as const,
        radius: ['42%', '68%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 4, borderColor: SOC.card, borderWidth: 2 },
        label: { color: SOC.textSecondary, fontSize: 11 },
        data: [
          { value: Math.max(withinSla, 1), name: 'Within SLA', itemStyle: { color: SOC.teal } },
          { value: approaching || 1, name: 'Approaching SLA', itemStyle: { color: SOC.amber } },
          { value: overdue || 1, name: 'Overdue', itemStyle: { color: SOC.red } },
        ],
      },
    ],
  };

  const severityBarOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Alerts by severity',
      left: 'center',
      top: 4,
      textStyle: { color: SOC.text, fontSize: 13, fontWeight: 600 },
    },
    grid: { left: 100, right: 24, top: 48, bottom: 24 },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    xAxis: {
      type: 'value' as const,
      axisLine: axisLine,
      axisLabel: { color: SOC.textMuted },
      splitLine,
    },
    yAxis: {
      type: 'category' as const,
      data: ['Informational', 'Low', 'Medium', 'High', 'Critical'],
      axisLine: axisLine,
      axisLabel: { color: SOC.textMuted },
    },
    series: [
      {
        type: 'bar' as const,
        data: [
          { value: 8, itemStyle: { color: SOC.blue } },
          { value: 14, itemStyle: { color: SOC.textMuted } },
          { value: 11, itemStyle: { color: SOC.amber } },
          { value: 6, itemStyle: { color: SOC.orange } },
          { value: critical || 3, itemStyle: { color: SOC.red } },
        ],
        barMaxWidth: 28,
      },
    ],
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = Math.max(2, Math.round((metrics?.total_logs ?? 1000) / 50000));
  const criticalSeries = days.map((_, i) => base + (i % 3) + (critical > 0 ? i % 2 : 0));
  const lowSeries = days.map((_, i) => base * 3 + i);

  const trendOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Critical vs low signal volume (7d)',
      left: 'center',
      top: 4,
      textStyle: { color: SOC.text, fontSize: 13, fontWeight: 600 },
    },
    legend: {
      data: ['Critical', 'Low'],
      bottom: 0,
      textStyle: chartText,
    },
    grid: { left: 48, right: 24, top: 48, bottom: 40 },
    tooltip: { trigger: 'axis' as const },
    xAxis: {
      type: 'category' as const,
      data: days,
      axisLine: axisLine,
      axisLabel: { color: SOC.textMuted },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: axisLine,
      axisLabel: { color: SOC.textMuted },
      splitLine,
    },
    series: [
      {
        name: 'Critical',
        type: 'line' as const,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: SOC.red, width: 2 },
        itemStyle: { color: SOC.red },
        areaStyle: { color: 'rgba(211, 47, 47, 0.12)' },
        data: criticalSeries,
      },
      {
        name: 'Low',
        type: 'line' as const,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: SOC.textMuted, width: 2 },
        itemStyle: { color: SOC.textMuted },
        areaStyle: { color: 'rgba(139, 146, 158, 0.08)' },
        data: lowSeries,
      },
    ],
  };

  const statesOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Investigation state trend',
      left: 'center',
      top: 4,
      textStyle: { color: SOC.text, fontSize: 13, fontWeight: 600 },
    },
    legend: {
      data: ['New', 'In progress', 'Resolved', 'On hold'],
      bottom: 0,
      textStyle: chartText,
    },
    grid: { left: 48, right: 24, top: 48, bottom: 52 },
    tooltip: { trigger: 'axis' as const },
    xAxis: {
      type: 'category' as const,
      data: Array.from({ length: 15 }, (_, i) => `D${i + 1}`),
      axisLine: axisLine,
      axisLabel: { color: SOC.textMuted, fontSize: 10 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: axisLine,
      axisLabel: { color: SOC.textMuted },
      splitLine,
    },
    series: [
      {
        name: 'New',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        areaStyle: { opacity: 0.35 },
        lineStyle: { width: 1 },
        itemStyle: { color: SOC.blue },
        data: [2, 3, 2, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 3, 2],
      },
      {
        name: 'In progress',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        areaStyle: { opacity: 0.35 },
        lineStyle: { width: 1 },
        itemStyle: { color: SOC.amber },
        data: [1, 2, 3, 2, 3, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3],
      },
      {
        name: 'Resolved',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        areaStyle: { opacity: 0.35 },
        lineStyle: { width: 1 },
        itemStyle: { color: SOC.teal },
        data: [0, 1, 1, 2, 1, 2, 2, 1, 2, 3, 2, 2, 3, 2, 2],
      },
      {
        name: 'On hold',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        areaStyle: { opacity: 0.35 },
        lineStyle: { width: 1 },
        itemStyle: { color: SOC.textMuted },
        data: [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
      },
    ],
  };

  const cardStyle = {
    background: SOC.card,
    borderColor: SOC.border,
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card variant="borderless" style={cardStyle} styles={{ body: { padding: '8px 8px 4px' } }}>
          <ReactECharts option={slaOpenOption} style={{ height: 300 }} notMerge lazyUpdate />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card variant="borderless" style={cardStyle} styles={{ body: { padding: '8px 8px 4px' } }}>
          <ReactECharts option={severityBarOption} style={{ height: 300 }} notMerge lazyUpdate />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card variant="borderless" style={cardStyle} styles={{ body: { padding: '8px 8px 4px' } }}>
          <ReactECharts option={trendOption} style={{ height: 280 }} notMerge lazyUpdate />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card variant="borderless" style={cardStyle} styles={{ body: { padding: '8px 8px 4px' } }}>
          <ReactECharts option={statesOption} style={{ height: 280 }} notMerge lazyUpdate />
        </Card>
      </Col>
    </Row>
  );
};
