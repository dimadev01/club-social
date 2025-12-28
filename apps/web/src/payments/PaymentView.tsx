import {
  type DueCategory,
  DueCategoryLabel,
  DueSettlementStatus,
  DueSettlementStatusLabel,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import {
  type PaymentDueSettlementDto,
  PaymentStatus,
  PaymentStatusLabel,
  type VoidPaymentDto,
} from '@club-social/shared/payments';
import { App, Button, Col, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NavigateToMember } from '@/ui/NavigateMember';
import { NavigateMemberLedgerEntry } from '@/ui/NavigateMemberLedgerEntry';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Row } from '@/ui/Row';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { usePayment } from './usePayment';

export function PaymentView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: payment, isLoading } = usePayment(id);

  const voidPayment = useMutation({
    mutationFn: (body: VoidPaymentDto) =>
      $fetch(`payments/${payment?.id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Pago anulado correctamente');
      navigate(-1);
    },
  });

  if (isLoading) {
    return <Card loading />;
  }

  if (!payment) {
    return <NotFound />;
  }

  const isMutating = voidPayment.isPending;
  const canVoid =
    permissions.payments.void && payment.status === PaymentStatus.PAID;

  return (
    <Page
      actions={[
        canVoid && (
          <Button
            danger
            disabled={isMutating}
            onClick={() => setIsVoidModalOpen(true)}
            type="primary"
          >
            Anular pago
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title="Detalle de pago"
    >
      <Row>
        <Col md={12} xs={24}>
          <Descriptions
            items={[
              {
                children: DateFormat.date(payment.date),
                label: 'Fecha',
              },
              {
                children: (
                  <NavigateToMember id={payment.member.id}>
                    {payment.member.name}
                  </NavigateToMember>
                ),
                label: 'Socio',
              },
              {
                children: NumberFormat.formatCurrencyCents(payment.amount),
                label: 'Monto',
              },
              {
                children: PaymentStatusLabel[payment.status],
                label: 'Estado',
              },
              {
                children: payment.receiptNumber ?? '-',
                label: 'Número de recibo',
              },
              {
                children: payment.notes ?? '-',
                label: 'Notas',
              },
            ]}
          />
        </Col>
        <Col md={12} xs={24}>
          <DescriptionsAudit {...payment} />
        </Col>
      </Row>

      <Divider />

      <Table<PaymentDueSettlementDto>
        columns={[
          {
            dataIndex: ['memberLedgerEntry', 'date'],
            render: (date: string, record: PaymentDueSettlementDto) => (
              <NavigateMemberLedgerEntry
                date={date}
                id={record.memberLedgerEntry.id}
              />
            ),
            title: 'Fecha',
          },
          {
            align: 'center',
            dataIndex: ['due', 'category'],
            render: (dueCategory: DueCategory) => DueCategoryLabel[dueCategory],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
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
            align: 'right',
            dataIndex: ['due', 'amount'],
            render: (dueAmount: number) =>
              NumberFormat.formatCurrencyCents(dueAmount),
            title: 'Monto deuda',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            title: 'Monto pago',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
        ]}
        dataSource={payment.settlements}
        loading={isLoading}
        pagination={false}
        size="small"
      />

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidPayment.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Page>
  );
}
