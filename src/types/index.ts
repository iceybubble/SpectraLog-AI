// Log Types
export interface Log {
  id: string;
  timestamp: string;
  source: 'windows' | 'android' | 'server' | 'iot' | 'cloud';
  severity: 'info' | 'warning' | 'error' | 'critical';
  event_type: string;
  message: string;
  device_id?: string;
  user?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
}

// Alert Types
export interface Alert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved';
  source: string;
  related_logs: string[];
  mitre_tactics?: string[];
  confidence?: number;
}

// Timeline Event
export interface TimelineEvent {
  timestamp: string;
  device: string;
  event: string;
  severity: number;
  source: string;
  details?: string;
}

// XAI Feature Explanation
export interface XAIFeature {
  name: string;
  value: string | number;
  impact: number; // -1 to 1
  explanation: string;
}

export interface XAIExplanation {
  alert_id: string;
  model: string;
  features: XAIFeature[];
  confidence: number;
  reasoning: string;
}

// Correlation Graph
export interface CorrelationNode {
  id: string;
  type: 'ip' | 'device' | 'user' | 'process' | 'file';
  label: string;
  risk_score?: number;
}

export interface CorrelationEdge {
  source: string;
  target: string;
  relationship: string;
  weight?: number;
}

export interface CorrelationGraph {
  nodes: CorrelationNode[];
  edges: CorrelationEdge[];
}

// Dashboard Metrics
export interface DashboardMetrics {
  total_logs: number;
  total_alerts: number;
  critical_alerts: number;
  open_investigations: number;
  devices_monitored: number;
  threat_score: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}