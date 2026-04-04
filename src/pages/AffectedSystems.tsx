import { Typography, Table, Tag, Progress, Space } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';
import { SOC } from '@/theme/socTokens';

const { Title, Paragraph } = Typography;

interface AssetRow {
  id: string;
  hostname: string;
  type: 'Endpoint' | 'Server' | 'Network' | 'Cloud';
  region: string;
  risk: number;
  status: 'Healthy' | 'Investigating' | 'Compromised';
  lastSeen: string;
}

const MOCK_ASSETS: AssetRow[] = [
  {
    id: 'a1',
    hostname: 'WS-FIN-0142',
    type: 'Endpoint',
    region: 'US-East',
    risk: 72,
    status: 'Investigating',
    lastSeen: '2 min ago',
  },
  {
    id: 'a2',
    hostname: 'SRV-DC-03',
    type: 'Server',
    region: 'EU-West',
    risk: 38,
    status: 'Healthy',
    lastSeen: '8 min ago',
  },
  {
    id: 'a3',
    hostname: 'FW-EDGE-01',
    type: 'Network',
    region: 'APAC',
    risk: 91,
    status: 'Compromised',
    lastSeen: '1 min ago',
  },
  {
    id: 'a4',
    hostname: 'AKS-PROD-7',
    type: 'Cloud',
    region: 'Global',
    risk: 44,
    status: 'Healthy',
    lastSeen: '15 min ago',
  },
];

const statusColor: Record<AssetRow['status'], string> = {
  Healthy: SOC.teal,
  Investigating: SOC.amber,
  Compromised: SOC.red,
};

export const AffectedSystems = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text }}>
          <DesktopOutlined style={{ marginRight: 10 }} />
          Affected systems — asset status
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Placeholder inventory until your CMDB or agent telemetry is wired (sitemap: Affected System →
          Asset Status).
        </Paragraph>
      </div>

      <Table<AssetRow>
        rowKey="id"
        dataSource={MOCK_ASSETS}
        pagination={false}
        columns={[
          { title: 'Asset', dataIndex: 'hostname', key: 'h' },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 't',
            render: (t: string) => <Tag>{t}</Tag>,
          },
          { title: 'Region', dataIndex: 'region', key: 'r' },
          {
            title: 'Risk score',
            dataIndex: 'risk',
            key: 'risk',
            width: 200,
            render: (n: number) => (
              <Progress
                percent={n}
                size="small"
                strokeColor={n > 80 ? SOC.red : n > 50 ? SOC.amber : SOC.teal}
                format={(p) => `${p}`}
              />
            ),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 's',
            render: (s: AssetRow['status']) => (
              <Tag style={{ color: statusColor[s], borderColor: statusColor[s] }}>{s}</Tag>
            ),
          },
          { title: 'Last seen', dataIndex: 'lastSeen', key: 'l' },
        ]}
      />
    </Space>
  );
};
