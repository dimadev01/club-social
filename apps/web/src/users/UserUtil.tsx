import type { GetProps } from 'antd';
import type { TagProps } from 'antd/lib';

import { UserStatus } from '@club-social/shared/users';

export const UserStatusColor: Record<UserStatus, GetProps<TagProps>['color']> =
  {
    [UserStatus.ACTIVE]: 'green',
    [UserStatus.INACTIVE]: 'red',
  } as const;
