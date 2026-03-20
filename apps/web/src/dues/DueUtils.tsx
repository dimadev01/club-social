import type { GetProps } from 'antd';
import type { TagProps } from 'antd/lib';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { DueCategory, DueStatus } from '@club-social/shared/dues';

export const DueStatusColor: Record<DueStatus, GetProps<TagProps>['color']> = {
  [DueStatus.PAID]: 'green',
  [DueStatus.PARTIALLY_PAID]: 'yellow',
  [DueStatus.PENDING]: 'default',
  [DueStatus.VOIDED]: 'red',
} as const;

export const DueStatusIcon: Record<DueStatus, React.ReactNode> = {
  [DueStatus.PAID]: <CheckCircleOutlined />,
  [DueStatus.PARTIALLY_PAID]: <ClockCircleOutlined />,
  [DueStatus.PENDING]: <ClockCircleOutlined />,
  [DueStatus.VOIDED]: <CloseCircleOutlined />,
} as const;

export const DueCategoryColor: Record<
  DueCategory,
  GetProps<TagProps>['color']
> = {
  [DueCategory.ELECTRICITY]: 'gold',
  [DueCategory.GUEST]: 'purple',
  [DueCategory.MEMBERSHIP]: 'green',
} as const;
