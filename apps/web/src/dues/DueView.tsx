import type { IPaymentDueDetailWithPaymentDto } from '@club-social/shared/payment-due';

import {
  DueCategoryLabel,
  DueStatus,
  DueStatusLabel,
  type VoidDueDto,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import {
  PaymentStatus,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
import { App, Button, Descriptions, Divider, Grid } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NavigateMember } from '@/ui/NavigateMember';
import { NavigatePayment } from '@/ui/NavigatePayment';
import { NotFound } from '@/ui/NotFound';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { useDue } from './useDue';
import { usePaymentDuesByDue } from './usePaymentDuesByDue';

export function DueView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: due, isLoading } = useDue(id);

  const { data: paymentDues, isLoading: isPaymentDuesLoading } =
    usePaymentDuesByDue(id);

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
      <Descriptions
        bordered
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Fecha">
          {DateFormat.date(due.date)}
        </Descriptions.Item>
        <Descriptions.Item label="Socio">
          <NavigateMember id={due.memberId} name={due.memberName} />
        </Descriptions.Item>
        <Descriptions.Item label="Monto">
          {NumberFormat.formatCents(due.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Categoría">
          {DueCategoryLabel[due.category]}
        </Descriptions.Item>
        <Descriptions.Item label="Estado" span="filled">
          {DueStatusLabel[due.status]}
        </Descriptions.Item>
        <Descriptions.Item label="Notas" span="filled">
          {due.notes ?? '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <DescriptionsAudit {...due} />

      <Divider />

      <Table<IPaymentDueDetailWithPaymentDto>
        columns={[
          {
            dataIndex: 'paymentId',
            render: (paymentId: string, record) => (
              <NavigatePayment date={record.paymentDate} id={paymentId} />
            ),
            title: 'Fecha',
          },
          {
            align: 'right',
            dataIndex: 'paymentAmount',
            render: (paymentAmount: number) =>
              NumberFormat.formatCents(paymentAmount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            dataIndex: 'paymentReceiptNumber',
            render: (paymentReceiptNumber: null | string) =>
              paymentReceiptNumber ?? '-',
            title: 'Recibo',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'paymentStatus',
            render: (paymentStatus: PaymentStatus) =>
              PaymentStatusLabel[paymentStatus],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
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
          voidDueMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
