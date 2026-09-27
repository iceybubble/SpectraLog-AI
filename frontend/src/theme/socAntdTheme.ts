import { theme } from 'antd';
import { SOC } from './socTokens';

/** Ant Design ConfigProvider theme for dark SOC UI */
export const socAntdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: SOC.primary,
    colorSuccess: SOC.teal,
    colorWarning: SOC.orange,
    colorError: SOC.red,
    colorInfo: SOC.blue,
    colorBgLayout: SOC.bg,
    colorBgContainer: SOC.card,
    colorBgElevated: SOC.bgElevated,
    colorBorder: SOC.border,
    colorBorderSecondary: SOC.borderSubtle,
    colorText: SOC.text,
    colorTextSecondary: SOC.textSecondary,
    colorTextTertiary: SOC.textMuted,
    borderRadius: SOC.radius,
    borderRadiusLG: SOC.radius,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      headerBg: SOC.bgElevated,
      bodyBg: SOC.bg,
      siderBg: '#0d1117',
      triggerBg: '#0d1117',
    },
    Menu: {
      darkItemBg: '#0d1117',
      darkSubMenuItemBg: '#0a0e14',
    },
    Card: {
      colorBgContainer: SOC.card,
    },
    Table: {
      colorBgContainer: SOC.card,
      headerBg: SOC.bgElevated,
    },
    Modal: {
      contentBg: SOC.card,
      headerBg: SOC.card,
    },
  },
};
