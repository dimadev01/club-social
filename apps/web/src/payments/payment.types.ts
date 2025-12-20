import type { TagProps } from 'antd';

import { PaymentStatus } from '@club-social/shared/payments';

export const PaymentStatusColor: Record<PaymentStatus, TagProps['color']> = {
  [PaymentStatus.PAID]: 'green',
  [PaymentStatus.VOIDED]: 'default',
} as const;
