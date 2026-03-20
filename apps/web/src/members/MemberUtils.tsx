import type { GetProps } from 'antd';
import type { TagProps } from 'antd/lib';

import { MemberStatus } from '@club-social/shared/members';

export const MemberStatusColor: Record<
  MemberStatus,
  GetProps<TagProps>['color']
> = {
  [MemberStatus.ACTIVE]: 'green',
  [MemberStatus.INACTIVE]: 'red',
} as const;
