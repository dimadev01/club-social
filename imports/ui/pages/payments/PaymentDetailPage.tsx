import { Breadcrumb, Card, Descriptions, Flex, Table } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { NotFound } from '@ui/components/NotFound';
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

  /**
   * Component
   */
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
        extra={`Recibo #${payment.receiptNumber}`}
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

            <Descriptions.Item label="Detalle del pago">
              <Table
                dataSource={payment.dues}
                pagination={false}
                size="small"
                bordered
                rowKey="dueId"
                columns={[
                  {
                    dataIndex: ['due', 'date'],
                    render: (date: string) => new DateUtcVo(date).format(),
                    title: 'Fecha',
                  },
                  {
                    dataIndex: ['due', 'category'],
                    render: (category: DueCategoryEnum, paymentDue) => {
                      if (category === DueCategoryEnum.MEMBERSHIP) {
                        return `${DueCategoryLabel[category]} (${new DateUtcVo(paymentDue.due.date).monthName()})`;
                      }

                      return DueCategoryLabel[category];
                    },
                    title: 'Categoría',
                  },
                  {
                    align: 'right',
                    dataIndex: ['due', 'amount'],
                    render: (amount: number) =>
                      new Money({ amount }).formatWithCurrency(),
                    title: 'Monto deudor',
                  },
                  {
                    align: 'right',
                    dataIndex: ['amount'],
                    render: (amount: number) =>
                      new Money({ amount }).formatWithCurrency(),
                    title: 'Monto registrado',
                  },
                ]}
              />
            </Descriptions.Item>

            <Descriptions.Item label="Notas">{payment.notes}</Descriptions.Item>
          </Descriptions>

          <Flex justify="space-between">
            <FormBackButton />

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
          </Flex>
        </>
      </Card>
    </>
  );
};
