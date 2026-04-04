import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  AlertOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { SOC } from '@/theme/socTokens';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedMenuKey = location.pathname.startsWith('/alerts')
    ? '/alerts'
    : location.pathname;

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'SOC Posture',
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: 'Logs Explorer',
    },
    {
      key: '/alerts',
      icon: <AlertOutlined />,
      label: 'Alerts',
    },
    {
      key: '/timeline',
      icon: <ClockCircleOutlined />,
      label: 'Timeline',
    },
    {
      key: '/correlation',
      icon: <BranchesOutlined />,
      label: 'Correlation',
    },
    {
      type: 'divider',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={200}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#0d1117',
        borderRight: `1px solid ${SOC.border}`,
      }}
    >
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${SOC.borderSubtle}`,
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        {!collapsed && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: SOC.text, fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>
              SpectraLog
            </div>
            <div style={{ color: SOC.textMuted, fontSize: 10, textTransform: 'uppercase' }}>
              SOC
            </div>
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenuKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ background: 'transparent', border: 'none' }}
      />
    </Sider>
  );
};
