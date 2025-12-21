import {
  type IVoidPaymentDto,
  PaymentStatus,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
import { App, Button, Descriptions, Grid, Tag } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { Card } from '@/ui/Card';
import { NotFound } from '@/ui/NotFound';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { PaymentStatusColor } from './payment.types';
import { usePayment } from './usePayment';

export function PaymentView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: payment, error, isLoading } = usePayment(id);

  if (error) {
    console.error(error);
  }

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
      <Descriptions
        bordered
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Fecha">
          {DateFormat.date(payment.date)}
        </Descriptions.Item>
        <Descriptions.Item label="Socio">
          {payment.memberName}
        </Descriptions.Item>
        <Descriptions.Item label="Monto total">
          {NumberFormat.formatCents(payment.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Tag color={PaymentStatusColor[payment.status]}>
            {PaymentStatusLabel[payment.status]}
          </Tag>
        </Descriptions.Item>
        {payment.notes && (
          <Descriptions.Item label="Notas" span={2}>
            {payment.notes}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Creado el">
          {DateFormat.dateTime(payment.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Creado por">
          {payment.createdBy}
        </Descriptions.Item>
      </Descriptions>

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidPayment.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
