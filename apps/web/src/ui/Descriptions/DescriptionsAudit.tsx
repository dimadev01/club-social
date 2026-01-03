import { DateFormat } from '@club-social/shared/lib';
import { UserRole } from '@club-social/shared/users';

import { useSessionUser } from '@/auth/useUser';

import { Descriptions } from '.';

interface Props {
  createdAt: string;
  createdBy: string;
  showVoidInfo?: boolean;
  updatedAt: string;
  updatedBy?: null | string;
  voidedAt?: null | string;
  voidedBy?: null | string;
  voidReason?: null | string;
}

export function DescriptionsAudit({ showVoidInfo = true, ...props }: Props) {
  const user = useSessionUser();

  if (user.role === UserRole.MEMBER) {
    return null;
  }

  return (
    <Descriptions
      bordered={false}
      items={[
        {
          children: props.createdBy,
          label: 'Creado por',
        },
        {
          children: DateFormat.dateTime(props.createdAt),
          label: 'Creado el',
        },
        {
          children: props.updatedBy,
          label: 'Actualizado por',
        },
        {
          children: DateFormat.dateTime(props.updatedAt),
          label: 'Actualizado el',
        },
        ...(showVoidInfo && props.voidedAt
          ? [
              {
                children: props.voidedBy ?? '-',
                label: 'Anulado por',
              },
              {
                children: props.voidedAt
                  ? DateFormat.dateTime(props.voidedAt)
                  : '-',
                label: 'Anulado el',
              },
              {
                children: props.voidReason ?? '-',
                label: 'Razón de anulación',
              },
            ]
          : []),
      ]}
    />
  );
}
