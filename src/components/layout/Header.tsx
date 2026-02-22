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
import { useStore } from '@/store/useStore';

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
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          SpectraLog AI
        </h2>
      </Space>

      <Space size="large">
        <Badge count={5} size="small">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '18px' }} />}
            size="large"
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
};