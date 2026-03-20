import type { GetProps, TagProps } from 'antd';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { MovementStatus } from '@club-social/shared/movements';

export const MovementStatusColor: Record<
  MovementStatus,
  GetProps<TagProps>['color']
> = {
  [MovementStatus.REGISTERED]: 'green',
  [MovementStatus.VOIDED]: 'red',
} as const;

export const MovementStatusIcon: Record<MovementStatus, React.ReactNode> = {
  [MovementStatus.REGISTERED]: <CheckCircleOutlined />,
  [MovementStatus.VOIDED]: <CloseCircleOutlined />,
} as const;
