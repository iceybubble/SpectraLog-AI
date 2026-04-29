import { useMemo, useState } from 'react';
import { Tabs, Select, Space, Typography, Button, Tooltip, message } from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { SOC } from '@/theme/socTokens';

const { Text } = Typography;

export type DashboardTabKey =
  | 'overview'
  | 'main'
  | 'ops'
  | 'status'
  | 'customer'
  | 'sla'
  | 'timers';

interface SocDashboardChromeProps {
  activeTab?: DashboardTabKey;
  onTabChange?: (key: DashboardTabKey) => void;
}

export const SocDashboardChrome = ({ activeTab: controlledTab, onTabChange }: SocDashboardChromeProps) => {
  const [localActiveTab, setLocalActiveTab] = useState<DashboardTabKey>('overview');
  const activeTab = controlledTab ?? localActiveTab;

  const tabItems: { key: DashboardTabKey; label: string }[] = [
    { key: 'overview', label: 'Security Overview' },
    { key: 'main', label: 'Main View' },
    { key: 'ops', label: 'Operations' },
    { key: 'status', label: 'Status' },
    { key: 'customer', label: "Customer's View" },
    { key: 'sla', label: 'SLA And Time' },
    { key: 'timers', label: 'Timers And Charts' },
  ];

  const tabPurpose = useMemo<Record<string, string>>(
    () => ({
      overview:
        'Executive snapshot of security posture, trend direction, and current risk signals.',
      main:
        'Primary analyst workspace that combines core KPIs, timeline context, and recent activity.',
      ops: 'Operational queue for triage, ownership, and current investigation throughput.',
      status: 'System and case status board to track open, investigating, and resolved work.',
      customer:
        'Business-facing view of incidents and impact, focused on communication and transparency.',
      sla: 'Response-time and resolution-time performance against committed service targets.',
      timers:
        'Time-series and timer-focused widgets for dwell time, MTTD, MTTR, and alert cadence.',
    }),
    [],
  );

  const handleRefresh = () => {
    message.success('Dashboard refresh requested. Data will sync on the next polling cycle.');
  };

  const handleExport = () => {
    message.info('Export is a planned action. This button is reserved for CSV/PDF snapshot downloads.');
  };

  const handleShare = () => {
    message.info('Share is a planned action. This will generate a dashboard link for teammates.');
  };

  const handleEdit = () => {
    message.info('Edit mode is placeholder-only for now and will be connected in a future update.');
  };

  const handleTabChange = (key: string) => {
    const nextTab = key as DashboardTabKey;
    if (onTabChange) {
      onTabChange(nextTab);
      return;
    }
    setLocalActiveTab(nextTab);
  };

  return (
    <div
      style={{
        marginBottom: 20,
        border: `1px solid ${SOC.border}`,
        borderRadius: SOC.radius,
        background: SOC.card,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '0 16px',
          borderBottom: `1px solid ${SOC.borderSubtle}`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          size="small"
          items={tabItems}
          style={{ marginBottom: -1, minWidth: 0, flex: 1 }}
          tabBarStyle={{ margin: 0 }}
        />
        <Space size="middle" wrap style={{ padding: '8px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Last updated: {new Date().toLocaleString()}
          </Text>
          <Tooltip title="Refresh dashboard widgets">
            <Button type="text" size="small" icon={<ReloadOutlined />} onClick={handleRefresh} />
          </Tooltip>
          <Tooltip title="Export dashboard snapshot (planned)">
            <Button type="text" size="small" icon={<DownloadOutlined />} onClick={handleExport} />
          </Tooltip>
          <Tooltip title="Share dashboard link (planned)">
            <Button type="text" size="small" icon={<ShareAltOutlined />} onClick={handleShare} />
          </Tooltip>
          <Button size="small" type="primary" ghost onClick={handleEdit}>
            Edit dashboard
          </Button>
        </Space>
      </div>
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          background: SOC.bgElevated,
        }}
      >
        <Select
          size="small"
          defaultValue="all"
          style={{ minWidth: 140 }}
          options={[
            { value: 'all', label: 'All workspaces' },
            { value: 'prod', label: 'Production' },
          ]}
        />
        <Select
          size="small"
          defaultValue="14d"
          style={{ minWidth: 160 }}
          options={[
            { value: '24h', label: 'Past 24 hours' },
            { value: '7d', label: 'Past 7 days' },
            { value: '14d', label: 'Past 14 days' },
            { value: '30d', label: 'Past 30 days' },
          ]}
        />
        <Select
          size="small"
          placeholder="Severity"
          allowClear
          style={{ minWidth: 120 }}
          options={[
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
        <Select
          size="small"
          placeholder="Tag"
          allowClear
          style={{ minWidth: 100 }}
        />
        <Select
          size="small"
          placeholder="Assignee"
          allowClear
          style={{ minWidth: 120 }}
        />
        <Select
          size="small"
          placeholder="State"
          allowClear
          style={{ minWidth: 100 }}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'investigating', label: 'Investigating' },
            { value: 'resolved', label: 'Resolved' },
          ]}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {tabPurpose[activeTab]}
        </Text>
      </div>
    </div>
  );
};
