import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MemberLedgerEntrySource,
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import { Col } from 'antd';
import { Link, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NavigateToPayment } from '@/ui/NavigateToPayment';
import { NotFound } from '@/ui/NotFound';
import { Row } from '@/ui/Row';

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
                  <Link to={appRoutes.members.view(entry.memberId)}>
                    {entry.memberFullName}
                  </Link>
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
