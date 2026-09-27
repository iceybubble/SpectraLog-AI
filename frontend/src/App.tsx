import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { socAntdTheme } from '@/theme/socAntdTheme';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Overview } from './pages/Overview';
import { Severity } from './pages/Severity';
import { LiveAttacks } from './pages/LiveAttacks';
import { ThreatMap } from './pages/ThreatMap';
import { AffectedSystems } from './pages/AffectedSystems';
import { LogsExplorer } from './pages/LogsExplorer';
import { Timeline } from './pages/Timeline';
import { AlertDetails } from './pages/AlertDetails';
import { Correlation } from './pages/Correlation';
import { Alerts } from './pages/Alerts';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={socAntdTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="overview" element={<Overview />} />
              <Route path="severity" element={<Severity />} />
              <Route path="live-attacks" element={<LiveAttacks />} />
              <Route path="threat-map" element={<ThreatMap />} />
              <Route path="affected-systems" element={<AffectedSystems />} />
              <Route path="logs" element={<LogsExplorer />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="alerts/:id" element={<AlertDetails />} />
              <Route path="correlation" element={<Correlation />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
