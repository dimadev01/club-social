import {
  DueCategoryLabel,
  type DueSettlementDto,
  type DueSettlementPaymentDto,
  DueSettlementStatus,
  DueSettlementStatusLabel,
  DueStatus,
  DueStatusLabel,
  type VoidDueDto,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import { App, Button, Col, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NavigateMember } from '@/ui/NavigateMember';
import { NavigateMemberLedgerEntry } from '@/ui/NavigateMemberLedgerEntry';
import { NavigateToPayment } from '@/ui/NavigatePayment';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Row } from '@/ui/Row';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { useDue } from './useDue';

export function DueView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: due, isLoading } = useDue(id);

  const voidDueMutation = useMutation<unknown, Error, VoidDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Cuota anulada correctamente');
      navigate(-1);
    },
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
    <Page
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
                children: (
                  <NavigateMember id={due.member.id}>
                    {due.member.name}
                  </NavigateMember>
                ),
                label: 'Socio',
              },
              {
                children: NumberFormat.formatCurrencyCents(due.amount),
                label: 'Monto',
              },
              {
                children: DueCategoryLabel[due.category],
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
              <NavigateMemberLedgerEntry
                date={date}
                id={record.memberLedgerEntry.id}
              />
            ),
            title: 'Fecha',
          },
          {
            align: 'right',
            dataIndex: ['amount'],
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
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
            dataIndex: 'payment',
            render: (payment: DueSettlementPaymentDto | null) =>
              payment ? (
                <NavigateToPayment formatDate={false} id={payment.id}>
                  Ver pago
                </NavigateToPayment>
              ) : (
                '-'
              ),
            title: 'Pago',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
        ]}
        dataSource={due.settlements}
        loading={isLoading}
        pagination={false}
        size="small"
        title={() => 'Movimientos de cuenta corriente'}
      />

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidDueMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Page>
  );
}
