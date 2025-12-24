import { type DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import {
  type IPaymentDueDetailWithDueDto,
  type PaymentDueStatus,
  PaymentDueStatusLabel,
} from '@club-social/shared/payment-due';
import {
  type IVoidPaymentDto,
  PaymentStatus,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
import { App, Button, Descriptions, Divider, Grid } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { usePaymentDuesByPayment } from '@/dues/usePaymentDuesByPayment';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NavigateDue } from '@/ui/NavigateDue';
import { NavigateMember } from '@/ui/NavigateMember';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { usePayment } from './usePayment';

export function PaymentView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: payment, isLoading } = usePayment(id);

  const { data: paymentDues, isLoading: isPaymentDuesLoading } =
    usePaymentDuesByPayment(id);

  const voidPayment = useMutation({
    mutationFn: (body: IVoidPaymentDto) =>
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
      <Descriptions
        bordered
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Fecha">
          {DateFormat.date(payment.date)}
        </Descriptions.Item>
        <Descriptions.Item label="Socio">
          <NavigateMember id={payment.memberId} name={payment.memberName} />
        </Descriptions.Item>
        <Descriptions.Item label="Monto">
          {NumberFormat.formatCents(payment.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          {PaymentStatusLabel[payment.status]}
        </Descriptions.Item>
        <Descriptions.Item label="Notas">
          {payment.notes ?? '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <DescriptionsAudit {...payment} />

      <Divider />

      <Table<IPaymentDueDetailWithDueDto>
        columns={[
          {
            dataIndex: 'dueId',
            render: (dueId: string, record) => (
              <NavigateDue date={record.dueDate} id={dueId} />
            ),
            title: 'Fecha',
          },
          {
            align: 'center',
            dataIndex: 'dueCategory',
            render: (dueCategory: DueCategory) => DueCategoryLabel[dueCategory],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },

          {
            align: 'center',
            dataIndex: 'status',
            render: (status: PaymentDueStatus) => PaymentDueStatusLabel[status],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'right',
            dataIndex: 'dueAmount',
            render: (dueAmount: number) => NumberFormat.formatCents(dueAmount),
            title: 'Monto deuda',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.formatCents(amount),
            title: 'Monto pago',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
        ]}
        dataSource={paymentDues}
        loading={isPaymentDuesLoading}
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
