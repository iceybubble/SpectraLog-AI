import axios, { AxiosError } from 'axios';
import type {
  Log,
  Alert,
  TimelineEvent,
  XAIExplanation,
  CorrelationGraph,
  DashboardMetrics,
  PaginatedResponse,
} from '@/types';

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

// Logs API
export const logsApi = {
  getLogs: async (params: {
    source?: string;
    severity?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Log>> => {
    const response = await api.get('/api/v1/logs', { params });
    return response.data;
  },

  getLogDetail: async (id: string): Promise<Log> => {
    const response = await api.get(`/api/v1/logs/${id}`);
    return response.data;
  },

  searchLogs: async (query: any): Promise<PaginatedResponse<Log>> => {
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
    const response = await api.get('/api/v1/alerts', { params });
    return response.data;
  },

  getAlertDetail: async (id: string): Promise<Alert> => {
    const response = await api.get(`/api/v1/alerts/${id}`);
    return response.data;
  },

  acknowledgeAlert: async (id: string): Promise<void> => {
    await api.post(`/api/v1/alerts/${id}/acknowledge`);
  },

  updateAlertStatus: async (id: string, status: string): Promise<void> => {
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
    const response = await api.get('/api/v1/correlation/timeline', { params });
    return response.data;
  },

  getCorrelationGraph: async (alertId: string): Promise<CorrelationGraph> => {
    const response = await api.get(`/api/v1/correlation/graph/${alertId}`);
    return response.data;
  },
};

// XAI API
export const xaiApi = {
  explainAlert: async (alertId: string): Promise<XAIExplanation> => {
    const response = await api.get(`/api/v1/xai/explain/${alertId}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get('/api/v1/dashboard/metrics');
    return response.data;
  },
};

// Enrichment API
export const enrichmentApi = {
  getIPInfo: async (ip: string): Promise<any> => {
    const response = await api.get(`/api/v1/enrichment/ip/${ip}`);
    return response.data;
  },

  getThreatIntel: async (indicator: string): Promise<any> => {
    const response = await api.get(`/api/v1/enrichment/threat-intel/${indicator}`);
    return response.data;
  },
};