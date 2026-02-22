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

// ... rest of the file remains the same