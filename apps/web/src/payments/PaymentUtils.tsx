import type { GetProps } from 'antd';
import type { TagProps } from 'antd/lib';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PaymentStatus } from '@club-social/shared/payments';

export const PaymentStatusColor: Record<
  PaymentStatus,
  GetProps<TagProps>['color']
> = {
  [PaymentStatus.PAID]: 'green',
  [PaymentStatus.VOIDED]: 'red',
} as const;

export const PaymentStatusIcon: Record<PaymentStatus, React.ReactNode> = {
  [PaymentStatus.PAID]: <CheckCircleOutlined />,
  [PaymentStatus.VOIDED]: <CloseCircleOutlined />,
} as const;
