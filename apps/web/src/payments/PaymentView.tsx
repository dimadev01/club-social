import {
  type DueCategory,
  DueSettlementStatus,
  DueSettlementStatusLabel,
} from '@club-social/shared/dues';
import { DateFormats, NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import {
  type PaymentDueSettlementDto,
  PaymentStatus,
  PaymentStatusLabel,
  type VoidPaymentDto,
} from '@club-social/shared/payments';
import { Button, Col, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { DueCategoryIconLabel } from '@/dues/DueCategoryIconLabel';
import { useVoidMutation } from '@/shared/hooks/useVoidMutation';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NavigateToDue } from '@/ui/NavigateDue';
import { NavigateToMember } from '@/ui/NavigateMember';
import { NavigateMemberLedgerEntry } from '@/ui/NavigateMemberLedgerEntry';
import { NotFound } from '@/ui/NotFound';
import { Row } from '@/ui/Row';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { usePayment } from './usePayment';

export function PaymentView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: payment, isLoading } = usePayment(id);

  const voidPaymentMutation = useVoidMutation<unknown, Error, VoidPaymentDto>({
    endpoint: `payments/${payment?.id}/void`,
    onSuccess: () => {
      navigate(-1);
    },
    successMessage: 'Pago anulado correctamente',
  });

  if (isLoading) {
    return <Card loading />;
  }

  if (!payment) {
    return <NotFound />;
  }

  const isMutating = voidPaymentMutation.isPending;
  const canVoid =
    permissions.payments.void && payment.status === PaymentStatus.PAID;

  return (
    <Card
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
            dataIndex: ['due', 'date'],
            render: (date: string, record: PaymentDueSettlementDto) => (
              <NavigateToDue dateFormat={DateFormats.date} id={record.due.id}>
                {date}
              </NavigateToDue>
            ),
            title: 'Fecha de deuda',
          },

          {
            align: 'center',
            dataIndex: ['due', 'category'],
            render: (dueCategory: DueCategory, record) => (
              <DueCategoryIconLabel
                category={dueCategory}
                date={record.due.date}
              />
            ),
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.DUE_CATEGORY,
          },

          {
            align: 'center',
            dataIndex: 'status',
            render: (status: DueSettlementStatus) =>
              DueSettlementStatusLabel[status],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.DUE_STATUS,
          },
          {
            align: 'right',
            dataIndex: ['due', 'amount'],
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
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
          {
            align: 'center',
            dataIndex: ['memberLedgerEntry', 'id'],
            render: (id: string) => (
              <NavigateMemberLedgerEntry formatDate={false} id={id}>
                Ver movimiento
              </NavigateMemberLedgerEntry>
            ),
            title: 'Movimiento',
            width: 150,
          },
        ]}
        dataSource={payment.settlements}
        loading={isLoading}
        pagination={false}
        size="small"
        title={() => 'Deudas asociadas'}
      />

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidPaymentMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
