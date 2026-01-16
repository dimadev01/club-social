import {
  type DueSettlementDto,
  DueSettlementStatus,
  DueSettlementStatusLabel,
  DueStatus,
  DueStatusLabel,
  type VoidDueDto,
} from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MemberLedgerEntrySource,
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatus,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryType,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import { Button, Col, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useVoidMutation } from '@/shared/hooks/useVoidMutation';
import {
  Card,
  Descriptions,
  DescriptionsAudit,
  NavigateToMemberLedgerEntry,
  NavigateToPayment,
  NotFound,
  Row,
  Table,
  TABLE_COLUMN_WIDTHS,
  VoidModal,
} from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { DueCategoryIconLabel } from './DueCategoryIconLabel';
import { useDue } from './useDue';

export function DueView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: due, isLoading } = useDue(id);

  const voidDueMutation = useVoidMutation<unknown, Error, VoidDueDto>({
    endpoint: `dues/${id}/void`,
    onSuccess: () => {
      navigate(-1);
    },
    successMessage: 'Cuota anulada correctamente',
  });

  if (isLoading) {
    return <Card loading />;
  }

  if (!due) {
    return <NotFound />;
  }

  const isMutating = voidDueMutation.isPending;
  const canEdit = permissions.dues.update && due.status === DueStatus.PENDING;
  const canVoid = permissions.dues.void && due.status === DueStatus.PENDING;

  return (
    <Card
      actions={[
        canEdit && (
          <Button
            disabled={isMutating}
            onClick={() => navigate(appRoutes.dues.edit(id))}
            type="primary"
          >
            Editar
          </Button>
        ),
        canVoid && (
          <Button
            danger
            disabled={isMutating}
            onClick={() => setIsVoidModalOpen(true)}
            type="primary"
          >
            Anular deuda
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title="Detalle de deuda"
    >
      <Row>
        <Col md={12} xs={24}>
          <Descriptions
            items={[
              {
                children: DateFormat.date(due.date),
                label: 'Fecha',
              },
              {
                children: due.member.name,
                label: 'Socio',
              },
              {
                children: NumberFormat.currencyCents(due.amount),
                label: 'Monto',
              },
              {
                children: (
                  <DueCategoryIconLabel
                    category={due.category}
                    date={due.date}
                  />
                ),
                label: 'Categoría',
              },
              {
                children: DueStatusLabel[due.status],
                label: 'Estado',
              },
              {
                children: due.notes ?? '-',
                label: 'Notas',
              },
            ]}
          />
        </Col>
        <Col md={12} xs={24}>
          <DescriptionsAudit {...due} />
        </Col>
      </Row>

      <Divider />

      <Table<DueSettlementDto>
        columns={[
          {
            dataIndex: ['memberLedgerEntry', 'date'],
            render: (date: string, record) => (
              <NavigateToMemberLedgerEntry id={record.memberLedgerEntry.id}>
                {date}
              </NavigateToMemberLedgerEntry>
            ),
            title: 'Fecha de movimiento',
          },
          {
            align: 'center',
            dataIndex: 'status',
            render: (status: DueSettlementStatus) =>
              DueSettlementStatusLabel[status],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: ['memberLedgerEntry', 'type'],
            render: (type: MemberLedgerEntryType) =>
              MemberLedgerEntryTypeLabel[type],
            title: 'Tipo de movimiento',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: ['memberLedgerEntry', 'status'],
            render: (status: MemberLedgerEntryStatus) =>
              MemberLedgerEntryStatusLabel[status],
            title: 'Estado de movimiento',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            dataIndex: ['memberLedgerEntry', 'source'],
            render: (source: MemberLedgerEntrySource, record) => {
              if (
                source === MemberLedgerEntrySource.PAYMENT &&
                record.payment
              ) {
                return (
                  <NavigateToPayment formatDate={false} id={record.payment.id}>
                    {MemberLedgerEntrySourceLabel[source]}
                  </NavigateToPayment>
                );
              }

              return MemberLedgerEntrySourceLabel[source];
            },
            title: 'Origen',
            width: TABLE_COLUMN_WIDTHS.ACTIONS,
          },
        ]}
        dataSource={due.settlements}
        loading={isLoading}
        pagination={false}
        size="small"
        title={() => 'Movimientos asociados'}
      />

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidDueMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
