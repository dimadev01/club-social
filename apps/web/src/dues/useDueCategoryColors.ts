import { purple, purpleDark } from '@ant-design/colors';
import { DueCategory } from '@club-social/shared/dues';
import { theme } from 'antd';

export function useDueCategoryColors(): Record<DueCategory, string> {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#000000';

  return {
    [DueCategory.ELECTRICITY]: token.colorWarning,
    [DueCategory.GUEST]: isDark ? purpleDark[5] : purple[5],
    [DueCategory.MEMBERSHIP]: token.colorSuccess,
  };
}
