import { Breadcrumb, Card, Descriptions, Divider, Flex, Space } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { NotFound } from '@ui/components/NotFound';
import { PaymentDuesGrid } from '@ui/components/Payments/PaymentDuesGrid';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { usePayment } from '@ui/hooks/payments/usePayment';
import { useNavigate } from '@ui/hooks/useNavigate';
import { useNotificationSuccess } from '@ui/hooks/useNotification';

export const PaymentDetailPage = () => {
  const { id: paymentId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: payment, error } = usePayment(
    paymentId ? { id: paymentId } : undefined,
  );

  const deletePayment = useDeletePayment();

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
            title: `Pago a ${payment.member.name} del ${new DateUtcVo(payment.date).format()}`,
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

            <Descriptions.Item label="Notas">{payment.notes}</Descriptions.Item>
          </Descriptions>

          <PaymentDuesGrid dues={payment.dues} />

          <Divider />

          <Flex justify="space-between">
            <FormBackButton />
            <Space.Compact>
              <FormVoidButton
                scope={ScopeEnum.PAYMENTS}
                onClick={() => {
                  deletePayment.mutate(
                    { id: payment.id },
                    {
                      onSuccess: () => {
                        notificationSuccess('Pago anulado');

                        navigate(AppUrl.Payments);
                      },
                    },
                  );
                }}
              />
              <FormDeleteButton
                scope={ScopeEnum.PAYMENTS}
                onClick={() => {
                  deletePayment.mutate(
                    { id: payment.id },
                    {
                      onSuccess: () => {
                        notificationSuccess('Pago eliminado');

                        navigate(AppUrl.Payments);
                      },
                    },
                  );
                }}
              />
            </Space.Compact>{' '}
          </Flex>
        </>
      </Card>
    </>
  );
};
