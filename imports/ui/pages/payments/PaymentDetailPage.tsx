import { Card, Descriptions, Divider, Flex, Space, Watermark } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { PaymentStatusLabel } from '@domain/payments/payment.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { PaymentsIcon } from '@ui/components/Icons/PaymentsIcon';
import { NotFound } from '@ui/components/NotFound';
import { PaymentDuesGrid } from '@ui/components/Payments/PaymentDuesGrid';
import { usePayment } from '@ui/hooks/payments/usePayment';
import { useVoidPayment } from '@ui/hooks/payments/useVoidPayment';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

export const PaymentDetailPage = () => {
  const { id: paymentId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const location = useLocation();

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
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <PaymentsIcon />
                <Link to={`..${UrlUtils.stringify(location.state)}`}>
                  Pagos
                </Link>
              </Space>
            ),
          },
          {
            title: `Pago de ${payment.member.name} del ${new DateVo(payment.date).format()}`,
          },
        ]}
      />

      <Watermark
        content={
          payment.isVoided ? PaymentStatusLabel[payment.status] : undefined
        }
      >
        <Card
          extra={<PaymentsIcon />}
          title={`Pago a ${payment.member.name} del ${new DateVo(payment.date).format()}`}
        >
          <>
            <Descriptions column={1} layout="vertical" colon={false}>
              <Descriptions.Item label="Fecha de creación del pago">
                {new DateTimeVo(payment.createdAt).format(
                  DateFormatEnum.DDMMYYHHmm,
                )}{' '}
                ({payment.createdBy})
              </Descriptions.Item>

              <Descriptions.Item label="Fecha de pago del socio">
                {new DateVo(payment.date).format()}
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
                {Money.from({ amount: payment.amount }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Notas">
                {payment.notes}
              </Descriptions.Item>

              {payment.isVoided && (
                <>
                  <Descriptions.Item label="Anulado el">
                    {payment.voidedAt
                      ? new DateTimeVo(payment.voidedAt).format(
                          DateFormatEnum.DDMMYYHHmm,
                        )
                      : ''}
                  </Descriptions.Item>

                  <Descriptions.Item label="Anulado por">
                    {payment.voidedBy}
                  </Descriptions.Item>

                  <Descriptions.Item label="Motivo de anulación">
                    {payment.voidReason}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>

            <PaymentDuesGrid dues={payment.dues} />

            <Divider />

            <Flex justify="space-between">
              <FormBackButton />

              <FormVoidButton
                scope={ScopeEnum.PAYMENTS}
                disabled={payment.isVoided}
                onConfirm={(reason: string) => {
                  voidPayment.mutate(
                    {
                      id: payment.id,
                      voidReason: reason,
                    },
                    {
                      onSuccess: () => {
                        notificationSuccess('Pago anulado');

                        navigate(-1);
                      },
                    },
                  );
                }}
              />
            </Flex>
          </>
        </Card>
      </Watermark>
    </>
  );
};
