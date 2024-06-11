import { Breadcrumb, Card, Descriptions, Divider, Flex } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  PaymentStatusEnum,
  PaymentStatusLabel,
} from '@domain/payments/payment.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { NotFound } from '@ui/components/NotFound';
import { PaymentDuesGrid } from '@ui/components/Payments/PaymentDuesGrid';
import { usePayment } from '@ui/hooks/payments/usePayment';
import { useVoidPayment } from '@ui/hooks/payments/useVoidPayment';
import { useNavigate } from '@ui/hooks/ui/useNavigate';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

export const PaymentDetailPage = () => {
  const { id: paymentId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: payment, error } = usePayment(
    paymentId ? { id: paymentId } : undefined,
  );

  const voidPayment = useVoidPayment();

  if (error) {
    return <NotFound />;
  }

  if (!payment) {
    return <Card loading />;
  }

  invariant(payment.member);

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.Payments}>Pagos</Link> },
          {
            title: `Pago de ${payment.member.name} del ${new DateUtcVo(payment.date).format()}`,
          },
        ]}
      />

      <Card
        title={`Pago a ${payment.member.name} del ${new DateUtcVo(payment.date).format()}`}
      >
        <>
          <Descriptions column={1} layout="vertical" colon={false}>
            <Descriptions.Item label="Fecha">
              {new DateUtcVo(payment.date).format()}
            </Descriptions.Item>

            <Descriptions.Item label="Socio">
              {payment.member.name}
            </Descriptions.Item>

            <Descriptions.Item label="Recibo #">
              {payment.receiptNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Estado">
              {PaymentStatusLabel[payment.status]}
            </Descriptions.Item>

            <Descriptions.Item label="Total Pago">
              {new Money({ amount: payment.amount }).formatWithCurrency()}
            </Descriptions.Item>

            <Descriptions.Item label="Notas">{payment.notes}</Descriptions.Item>
          </Descriptions>

          <PaymentDuesGrid dues={payment.dues} />

          <Divider />

          <Flex justify="space-between">
            <FormBackButton />

            <FormVoidButton
              scope={ScopeEnum.PAYMENTS}
              disabled={payment.status === PaymentStatusEnum.VOIDED}
              onConfirm={(reason: string) => {
                voidPayment.mutate(
                  {
                    id: payment.id,
                    voidReason: reason,
                  },
                  {
                    onSuccess: () => {
                      notificationSuccess('Pago anulado');

                      navigate(AppUrl.Payments);
                    },
                  },
                );
              }}
            />
          </Flex>
        </>
      </Card>
    </>
  );
};
