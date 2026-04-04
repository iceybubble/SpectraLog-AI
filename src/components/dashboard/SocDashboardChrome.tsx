import { Tabs, Select, Space, Typography, Button } from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { SOC } from '@/theme/socTokens';

const { Text } = Typography;

export const SocDashboardChrome = () => {
  const tabItems = [
    { key: 'posture', label: 'SOC Posture' },
    { key: 'main', label: 'Main View' },
    { key: 'ops', label: 'Operations' },
    { key: 'status', label: 'Status' },
    { key: 'customer', label: "Customer's View" },
    { key: 'sla', label: 'SLA And Time' },
    { key: 'timers', label: 'Timers And Charts' },
  ];

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
          defaultActiveKey="posture"
          size="small"
          items={tabItems}
          style={{ marginBottom: -1, minWidth: 0, flex: 1 }}
          tabBarStyle={{ margin: 0 }}
        />
        <Space size="middle" wrap style={{ padding: '8px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Last updated: {new Date().toLocaleString()}
          </Text>
          <Button type="text" size="small" icon={<ReloadOutlined />} />
          <Button type="text" size="small" icon={<DownloadOutlined />} />
          <Button type="text" size="small" icon={<ShareAltOutlined />} />
          <Button size="small" type="primary" ghost>
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
      </div>
    </div>
  );
};
