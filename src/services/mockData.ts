import type {
  Alert,
  CorrelationGraph,
  DashboardMetrics,
  Log,
  PaginatedResponse,
  TimelineEvent,
  XAIExplanation,
} from '@/types';

export const isMockMode = (): boolean =>
  import.meta.env.VITE_USE_MOCK === 'true';

const MOCK_LOGS: Log[] = Array.from({ length: 48 }, (_, i) => ({
  id: `log-${String(i + 1).padStart(4, '0')}`,
  timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
  source: (['windows', 'android', 'server', 'iot', 'cloud'] as const)[i % 5],
  severity: (['info', 'warning', 'error', 'critical'] as const)[i % 4],
  event_type: i % 3 === 0 ? 'auth_failure' : i % 3 === 1 ? 'network' : 'process',
  message: `Sample security event ${i + 1}: activity observed on monitored endpoint.`,
  device_id: `dev-${(i % 12) + 1}`,
  user: i % 5 === 0 ? undefined : `user${(i % 8) + 1}`,
  ip_address: `192.168.${(i % 3) + 1}.${(i % 200) + 10}`,
  metadata: { index: i, mock: true },
}));

export const mockDashboardMetrics: DashboardMetrics = {
  total_logs: 1_240_893,
  total_alerts: 42,
  critical_alerts: 3,
  open_investigations: 5,
  devices_monitored: 128,
  threat_score: 0.35,
};

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
    title: 'Suspicious login pattern',
    description: 'Multiple failed authentication attempts from an unusual geographic region.',
    severity: 'high',
    status: 'open',
    source: 'windows',
    related_logs: ['log-0001', 'log-0002'],
    mitre_tactics: ['T1078'],
    confidence: 0.87,
  },
  {
    id: 'alert-002',
    timestamp: new Date(Date.now() - 5 * 3600_000).toISOString(),
    title: 'Unusual outbound traffic',
    description: 'Spike in connections to a rare external IP on port 443.',
    severity: 'medium',
    status: 'open',
    source: 'server',
    related_logs: ['log-0005'],
    mitre_tactics: ['T1071'],
    confidence: 0.72,
  },
  {
    id: 'alert-003',
    timestamp: new Date(Date.now() - 26 * 3600_000).toISOString(),
    title: 'Possible malware execution',
    description: 'Process chain consistent with known dropper behavior.',
    severity: 'critical',
    status: 'investigating',
    source: 'windows',
    related_logs: ['log-0010', 'log-0011', 'log-0012'],
    mitre_tactics: ['T1204', 'T1059'],
    confidence: 0.91,
  },
];

export function mockPaginatedLogs(params: {
  source?: string;
  severity?: string;
  limit?: number;
  offset?: number;
}): PaginatedResponse<Log> {
  let rows = [...MOCK_LOGS];
  if (params.source) {
    rows = rows.filter((l) => l.source === params.source);
  }
  if (params.severity) {
    rows = rows.filter((l) => l.severity === params.severity);
  }
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const items = rows.slice(offset, offset + limit);
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.floor(offset / limit) + 1;
  return { items, total, page, size: limit, pages };
}

export function mockPaginatedAlerts(params: {
  status?: string;
  severity?: string;
  limit?: number;
}): PaginatedResponse<Alert> {
  let rows = [...mockAlerts];
  if (params.status) {
    rows = rows.filter((a) => a.status === params.status);
  }
  if (params.severity) {
    rows = rows.filter((a) => a.severity === params.severity);
  }
  const limit = params.limit ?? 10;
  const items = rows.slice(0, limit);
  return {
    items,
    total: rows.length,
    page: 1,
    size: limit,
    pages: 1,
  };
}

export function mockAlertById(id: string): Alert | undefined {
  return mockAlerts.find((a) => a.id === id);
}

export function mockTimeline(params: {
  start_time: string;
  end_time: string;
  source?: string;
}): TimelineEvent[] {
  const start = new Date(params.start_time).getTime();
  const end = new Date(params.end_time).getTime();
  const span = Math.max(end - start, 1);
  const sources = ['Windows', 'Android', 'Server', 'IoT', 'Cloud'];
  return [0, 1, 2, 3, 4].map((i) => {
    const t = new Date(start + (span * (i + 1)) / 6).toISOString();
    const src = sources[i];
    return {
      timestamp: t,
      device: `device-${i + 1}`,
      event: `Event phase ${i + 1}`,
      severity: 2 + (i % 3),
      source: params.source
        ? params.source.charAt(0).toUpperCase() + params.source.slice(1)
        : src,
      details: 'Synthetic timeline point for demo.',
    };
  });
}

export function mockCorrelationGraph(alertId: string): CorrelationGraph {
  return {
    nodes: [
      {
        id: 'n0',
        type: 'device',
        label: `Alert ${alertId}`,
        risk_score: 0.35,
      },
      { id: 'n1', type: 'ip', label: '192.168.1.50', risk_score: 0.6 },
      { id: 'n2', type: 'device', label: 'WORKSTATION-12', risk_score: 0.4 },
      { id: 'n3', type: 'user', label: 'jdoe', risk_score: 0.2 },
      { id: 'n4', type: 'process', label: 'powershell.exe', risk_score: 0.55 },
    ],
    edges: [
      { source: 'n0', target: 'n1', relationship: 'related_alert', weight: 0.6 },
      { source: 'n1', target: 'n2', relationship: 'connected_to', weight: 0.8 },
      { source: 'n2', target: 'n3', relationship: 'used_by', weight: 0.5 },
      { source: 'n2', target: 'n4', relationship: 'spawned', weight: 0.9 },
    ],
  };
}

export function mockXaiExplanation(alertId: string): XAIExplanation {
  return {
    alert_id: alertId,
    model: 'spectralog-xai-demo',
    confidence: 0.84,
    reasoning:
      'Demo explanation: elevated risk driven by authentication anomalies and correlated process activity.',
    features: [
      {
        name: 'failed_logins',
        value: 12,
        impact: 0.7,
        explanation: 'Higher than baseline for this principal.',
      },
      {
        name: 'geo_anomaly',
        value: 'yes',
        impact: 0.5,
        explanation: 'Login origin inconsistent with recent history.',
      },
      {
        name: 'time_of_day',
        value: 'off_hours',
        impact: 0.3,
        explanation: 'Activity outside typical working hours.',
      },
    ],
  };
}
