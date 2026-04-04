import { useMemo, useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Select,
  Space,
  Table,
  Tag,
  Button,
} from 'antd';
import { GlobalOutlined, DesktopOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { WorldThreatMap } from '@/components/threatmap/WorldThreatMap';
import { DEMO_GEO_ORIGINS, filterByRegion, colorForSeverity } from '@/data/geoOrigins';
import type { GeoOriginPoint } from '@/data/geoOrigins';
import { SOC } from '@/theme/socTokens';

const { Title, Text, Paragraph } = Typography;

const cardStyle = {
  background: SOC.card,
  border: `1px solid ${SOC.border}`,
  borderRadius: SOC.radius,
};

export const ThreatMap = () => {
  const [region, setRegion] = useState<string | undefined>(undefined);

  const points = useMemo(() => filterByRegion(DEMO_GEO_ORIGINS, region), [region]);

  const sourceTotals = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of DEMO_GEO_ORIGINS) {
      m.set(p.source, (m.get(p.source) ?? 0) + p.count);
    }
    return [...m.entries()].map(([name, value]) => ({ name, value }));
  }, []);

  const donutOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      title: {
        text: `${DEMO_GEO_ORIGINS.reduce((s, p) => s + p.count, 0).toLocaleString()}`,
        subtext: 'Total events',
        left: 'center',
        top: '38%',
        textStyle: { color: SOC.text, fontSize: 18, fontWeight: 700 },
        subtextStyle: { color: SOC.textMuted, fontSize: 11 },
      },
      tooltip: { trigger: 'item' as const },
      legend: {
        bottom: 4,
        textStyle: { color: SOC.textMuted, fontSize: 10 },
      },
      series: [
        {
          type: 'pie' as const,
          radius: ['48%', '72%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: SOC.card, borderWidth: 2 },
          label: { color: SOC.textSecondary, fontSize: 10 },
          data: sourceTotals.map((d, i) => ({
            ...d,
            itemStyle: {
              color: [SOC.teal, SOC.blue, SOC.purple, SOC.amber, SOC.green][i % 5],
            },
          })),
        },
      ],
    }),
    [sourceTotals]
  );

  const columns = [
    {
      title: 'Country / region',
      dataIndex: 'country',
      key: 'country',
      render: (c: string, r: GeoOriginPoint) => (
        <Space>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: colorForSeverity(r.severity),
              display: 'inline-block',
            }}
          />
          <Text strong style={{ color: SOC.text }}>
            {c}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Events',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      sorter: (a: GeoOriginPoint, b: GeoOriginPoint) => a.count - b.count,
      render: (n: number) => n.toLocaleString(),
    },
    {
      title: 'Sample IP',
      dataIndex: 'sampleIp',
      key: 'sampleIp',
      render: (ip: string) => (
        <Text code style={{ fontSize: 12, color: SOC.teal }}>
          {ip}
        </Text>
      ),
    },
    {
      title: 'Log source',
      dataIndex: 'source',
      key: 'source',
      width: 110,
      render: (s: string) => <Tag>{s}</Tag>,
    },
    {
      title: 'Last activity',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: 160,
      render: (t: string) => (
        <Text style={{ color: SOC.red, fontSize: 12, fontFamily: 'monospace' }}>
          {format(new Date(t), "yyyy-MM-dd HH:mm:ss'Z'")}
        </Text>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, color: SOC.text }}>
          <GlobalOutlined style={{ marginRight: 10 }} />
          Threat map — geo view
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 720 }}>
          Bubble size reflects event volume at approximate country centroids. Wire your pipeline to GeoIP
          enrichment so coordinates derive from real client IPs in logs.
        </Paragraph>
      </div>

      <Card variant="borderless" style={cardStyle}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Text type="secondary">Region filter</Text>
              <Select
                allowClear
                placeholder="All regions"
                style={{ minWidth: 200 }}
                value={region}
                onChange={setRegion}
                options={DEMO_GEO_ORIGINS.map((p) => ({
                  value: p.iso2,
                  label: `${p.country} (${p.iso2})`,
                }))}
              />
              <Link to="/logs">
                <Button type="link">View assets & logs →</Button>
              </Link>
              <Link to="/affected-systems">
                <Button type="link" icon={<DesktopOutlined />}>
                  Affected systems
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            variant="borderless"
            title={
              <Text strong style={{ color: SOC.text }}>
                World map — log / attack origins by geography
              </Text>
            }
            style={{ ...cardStyle, overflow: 'hidden' }}
            styles={{ body: { padding: 0 } }}
          >
            <WorldThreatMap points={points} height={440} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card variant="borderless" style={{ ...cardStyle, height: '100%' }}>
            <Text strong style={{ color: SOC.text, display: 'block', marginBottom: 8 }}>
              Volume by log source
            </Text>
            <ReactECharts option={donutOption} style={{ height: 280 }} notMerge lazyUpdate />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Mirrors Sentinel-style “donut + source splits”; swap series when your API exposes
              table/category fields.
            </Text>
          </Card>
        </Col>
      </Row>

      <Card
        variant="borderless"
        title={
          <Text strong style={{ color: SOC.text }}>
            Recent origins (sample)
          </Text>
        }
        style={cardStyle}
      >
        <Table<GeoOriginPoint>
          size="small"
          rowKey={(r) => r.country + r.sampleIp}
          columns={columns}
          dataSource={[...points].sort((a, b) => b.count - a.count)}
          pagination={{ pageSize: 8, showSizeChanger: true }}
        />
      </Card>
    </Space>
  );
};
