import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MemberLedgerEntrySource,
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import { Col } from 'antd';
import { useParams } from 'react-router';

import {
  Card,
  Descriptions,
  DescriptionsAudit,
  NavigateToMember,
  NavigateToPayment,
  NotFound,
  Row,
} from '@/ui';

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

  const renderSource = () => {
    if (entry.source === MemberLedgerEntrySource.PAYMENT && entry.paymentId) {
      return (
        <NavigateToPayment formatDate={false} id={entry.paymentId}>
          {MemberLedgerEntrySourceLabel[entry.source]}
        </NavigateToPayment>
      );
    }

    return MemberLedgerEntrySourceLabel[entry.source];
  };

  return (
    <Card backButton title="Detalle de entrada de libro mayor">
      <Row>
        <Col md={12} xs={24}>
          <Descriptions
            items={[
              {
                children: DateFormat.date(entry.date),
                label: 'Fecha',
              },
              {
                children: (
                  <NavigateToMember id={entry.memberId}>
                    {entry.memberFullName}
                  </NavigateToMember>
                ),
                label: 'Socio',
              },
              {
                children: MemberLedgerEntryTypeLabel[entry.type],
                label: 'Tipo',
              },
              {
                children: NumberFormat.formatCurrencyCents(entry.amount),
                label: 'Monto',
              },
              {
                children: MemberLedgerEntryStatusLabel[entry.status],
                label: 'Estado',
              },
              {
                children: renderSource(),
                label: 'Origen',
              },
              {
                children: entry.notes ?? '-',
                label: 'Notas',
              },
            ]}
          />
        </Col>

        <Col md={12} xs={24}>
          <DescriptionsAudit {...entry} />
        </Col>
      </Row>
    </Card>
  );
}
