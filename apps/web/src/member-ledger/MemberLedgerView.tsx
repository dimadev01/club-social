import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import { Divider } from 'antd';
import { Link, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';

import { useMemberLedgerEntry } from './useMemberLedgerEntry';

export function MemberLedgerView() {
  const { id } = useParams();

  const { data: entry, isLoading } = useMemberLedgerEntry(id);

  if (isLoading) {
    return <Card loading />;
  }

  if (!entry) {
    return <NotFound />;
  }

  return (
    <Page backButton title="Detalle de entrada de libro mayor">
      <Descriptions
        items={[
          {
            children: DateFormat.date(entry.date),
            label: 'Fecha',
          },
          {
            children: (
              <Link to={appRoutes.members.view(entry.memberId)}>
                {entry.memberFullName}
              </Link>
            ),
            label: 'Socio',
          },
          {
            children:
              MemberLedgerEntryTypeLabel[
                entry.type as keyof typeof MemberLedgerEntryTypeLabel
              ],
            label: 'Tipo',
          },
          {
            children: NumberFormat.formatCurrencyCents(entry.amount),
            label: 'Monto',
          },
          {
            children:
              MemberLedgerEntryStatusLabel[
                entry.status as keyof typeof MemberLedgerEntryStatusLabel
              ],
            label: 'Estado',
          },
          {
            children:
              MemberLedgerEntrySourceLabel[
                entry.source as keyof typeof MemberLedgerEntrySourceLabel
              ],
            label: 'Origen',
          },
          {
            children: entry.paymentId ? (
              <Link to={appRoutes.payments.view(entry.paymentId)}>
                Ver pago
              </Link>
            ) : (
              '-'
            ),
            label: 'Pago asociado',
          },
          {
            children: entry.notes ?? '-',
            label: 'Notas',
          },
        ]}
      />
      <Divider />

      <DescriptionsAudit {...entry} />
    </Page>
  );
}
