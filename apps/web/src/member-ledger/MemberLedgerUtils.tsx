import type { GetProps } from 'antd';
import type { TagProps } from 'antd/lib';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { MemberLedgerEntryStatus } from '@club-social/shared/members';

export const MemberLedgerEntryStatusColor: Record<
  MemberLedgerEntryStatus,
  GetProps<TagProps>['color']
> = {
  [MemberLedgerEntryStatus.POSTED]: 'green',
  [MemberLedgerEntryStatus.REVERSED]: 'red',
} as const;

export const MemberLedgerEntryStatusIcon: Record<
  MemberLedgerEntryStatus,
  React.ReactNode
> = {
  [MemberLedgerEntryStatus.POSTED]: <CheckCircleOutlined />,
  [MemberLedgerEntryStatus.REVERSED]: <CloseCircleOutlined />,
} as const;
