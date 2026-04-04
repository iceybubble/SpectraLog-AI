import axios, { AxiosError } from 'axios';
import type {
  Log,
  Alert,
  TimelineEvent,
  XAIExplanation,
  CorrelationGraph,
  DashboardMetrics,
  PaginatedResponse,
  LogSearchBody,
} from '@/types';
import {
  isMockMode,
  mockDashboardMetrics,
  mockPaginatedLogs,
  mockPaginatedAlerts,
  mockAlertById,
  mockTimeline,
  mockCorrelationGraph,
  mockXaiExplanation,
} from '@/services/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const mock = isMockMode();

// Logs API
export const logsApi = {
  getLogs: async (params: {
    source?: string;
    severity?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Log>> => {
    if (mock) return mockPaginatedLogs(params);
    const response = await api.get('/api/v1/logs', { params });
    return response.data;
  },

  getLogDetail: async (id: string): Promise<Log> => {
    if (mock) {
      const page = mockPaginatedLogs({ limit: 100, offset: 0 });
      const found = page.items.find((l) => l.id === id);
      if (!found) throw new Error('Log not found');
      return found;
    }
    const response = await api.get(`/api/v1/logs/${id}`);
    return response.data;
  },

  searchLogs: async (query: LogSearchBody): Promise<PaginatedResponse<Log>> => {
    if (mock) {
      return mockPaginatedLogs({
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,
      });
    }
    const response = await api.post('/api/v1/logs/search', query);
    return response.data;
  },
};

// Alerts API
export const alertsApi = {
  getAlerts: async (params: {
    status?: string;
    severity?: string;
    limit?: number;
  }): Promise<PaginatedResponse<Alert>> => {
    if (mock) return mockPaginatedAlerts(params);
    const response = await api.get('/api/v1/alerts', { params });
    return response.data;
  },

  getAlertDetail: async (id: string): Promise<Alert> => {
    if (mock) {
      const a = mockAlertById(id);
      if (!a) throw new Error('Alert not found');
      return a;
    }
    const response = await api.get(`/api/v1/alerts/${id}`);
    return response.data;
  },

  acknowledgeAlert: async (_id: string): Promise<void> => {
    if (mock) return;
    await api.post(`/api/v1/alerts/${_id}/acknowledge`);
  },

  updateAlertStatus: async (id: string, status: string): Promise<void> => {
    if (mock) return;
    await api.patch(`/api/v1/alerts/${id}`, { status });
  },
};

// Correlation API
export const correlationApi = {
  getTimeline: async (params: {
    start_time: string;
    end_time: string;
    source?: string;
  }): Promise<TimelineEvent[]> => {
    if (mock) return mockTimeline(params);
    const response = await api.get('/api/v1/correlation/timeline', { params });
    return response.data;
  },

  getCorrelationGraph: async (alertId: string): Promise<CorrelationGraph> => {
    if (mock) return mockCorrelationGraph(alertId);
    const response = await api.get(`/api/v1/correlation/graph/${alertId}`);
    return response.data;
  },
};

// XAI API
export const xaiApi = {
  explainAlert: async (alertId: string): Promise<XAIExplanation> => {
    if (mock) return mockXaiExplanation(alertId);
    const response = await api.get(`/api/v1/xai/explain/${alertId}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    if (mock) return mockDashboardMetrics;
    const response = await api.get('/api/v1/dashboard/metrics');
    return response.data;
  },
};

// Enrichment API
export const enrichmentApi = {
  getIPInfo: async (ip: string): Promise<Record<string, unknown>> => {
    if (mock) {
      return { ip, mock: true, reputation: 'unknown' };
    }
    const response = await api.get(`/api/v1/enrichment/ip/${ip}`);
    return response.data;
  },

  getThreatIntel: async (
    indicator: string
  ): Promise<Record<string, unknown>> => {
    if (mock) {
      return { indicator, mock: true, hits: 0 };
    }
    const response = await api.get(
      `/api/v1/enrichment/threat-intel/${indicator}`
    );
    return response.data;
  },
};
