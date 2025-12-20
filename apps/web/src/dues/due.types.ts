import type { TagProps } from 'antd';

import { DueStatus } from '@club-social/shared/dues';

export const DueStatusColor: Record<DueStatus, TagProps['color']> = {
  [DueStatus.PAID]: 'green',
  [DueStatus.PARTIALLY_PAID]: 'orange',
  [DueStatus.PENDING]: 'blue',
  [DueStatus.VOIDED]: 'default',
} as const;
