import { create } from 'zustand';
import type { Alert, Log } from '@/types';

interface AppState {
  // User preferences
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  
  // Current selections
  selectedAlert: Alert | null;
  selectedLog: Log | null;
  
  // Filters
  timeRange: [string, string] | null;
  selectedSources: string[];
  selectedSeverities: string[];
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSelectedAlert: (alert: Alert | null) => void;
  setSelectedLog: (log: Log | null) => void;
  setTimeRange: (range: [string, string] | null) => void;
  setSelectedSources: (sources: string[]) => void;
  setSelectedSeverities: (severities: string[]) => void;
  resetFilters: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  theme: 'light',
  sidebarCollapsed: false,
  selectedAlert: null,
  selectedLog: null,
  timeRange: null,
  selectedSources: [],
  selectedSeverities: [],
  
  // Actions
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedAlert: (alert) => set({ selectedAlert: alert }),
  setSelectedLog: (log) => set({ selectedLog: log }),
  setTimeRange: (range) => set({ timeRange: range }),
  setSelectedSources: (sources) => set({ selectedSources: sources }),
  setSelectedSeverities: (severities) => set({ selectedSeverities: severities }),
  resetFilters: () =>
    set({
      timeRange: null,
      selectedSources: [],
      selectedSeverities: [],
    }),
}));