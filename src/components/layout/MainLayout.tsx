import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SOC } from '@/theme/socTokens';

const { Content } = Layout;

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh', background: SOC.bg }}>
      <Sidebar collapsed={collapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'all 0.2s',
          background: SOC.bg,
        }}
      >
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content
          style={{
            margin: '16px',
            padding: '20px 24px 32px',
            minHeight: 280,
            background: SOC.bg,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
