import { Layout, Badge, Button, Space, Avatar, Dropdown } from 'antd';
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { SOC } from '@/theme/socTokens';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header = ({ collapsed, onToggle }: HeaderProps) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 20px',
        background: SOC.bgElevated,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${SOC.border}`,
        height: 56,
        lineHeight: '56px',
      }}
    >
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 44,
            height: 44,
            color: SOC.textSecondary,
          }}
        />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: SOC.text }}>
          SpectraLog AI
        </h2>
        <span
          style={{
            fontSize: 11,
            color: SOC.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderLeft: `1px solid ${SOC.border}`,
            paddingLeft: 12,
            marginLeft: 4,
          }}
        >
          Security operations
        </span>
      </Space>

      <Space size="middle">
        <Badge count={5} size="small" color={SOC.red}>
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '18px', color: SOC.textSecondary }} />}
            size="large"
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            style={{ backgroundColor: SOC.primary, cursor: 'pointer' }}
            icon={<UserOutlined />}
            size="default"
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
};
