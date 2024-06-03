import { Breadcrumb, Card, Descriptions, Flex, Table } from 'antd';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/money.utils';
import { AppUrl } from '@ui/app.enum';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { NotFound } from '@ui/components/NotFound';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { usePayment } from '@ui/hooks/payments/usePayment';

export const PaymentDetailPage = () => {
  const { id: paymentId } = useParams<{ id?: string }>();

  const { data: payment, error } = usePayment(
    paymentId ? { id: paymentId } : undefined,
  );

  const deletePayment = useDeletePayment();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

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
          { title: `Pago a ${payment.memberName} del ${payment.date}` },
        ]}
      />

      <Card
        title={`Pago a ${payment.memberName} del ${payment.date}`}
        extra={`Recibo #${payment.receiptNumber}`}
      >
        <>
          <Descriptions column={1} layout="vertical" colon={false}>
            <Descriptions.Item label="Fecha">{payment.date}</Descriptions.Item>

            <Descriptions.Item label="Socio">
              {payment.memberName}
            </Descriptions.Item>

            <Descriptions.Item label="Recibo #">
              {payment.receiptNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Deudas pagas">
              <Table
                dataSource={payment.dues}
                pagination={false}
                size="small"
                bordered
                rowKey="dueId"
                columns={[
                  {
                    dataIndex: 'dueDate',
                    title: 'Fecha',
                  },
                  {
                    dataIndex: 'dueCategory',
                    render: (category: DueCategoryEnum) =>
                      `${DueCategoryLabel[category]}`,
                    title: 'Categoría',
                  },
                  {
                    dataIndex: 'dueAmount',
                    render: (dueAmount: number) =>
                      MoneyUtils.formatCents(dueAmount),
                    title: 'Monto deudor',
                  },
                  {
                    dataIndex: 'amount',
                    render: (amount: number) => MoneyUtils.formatCents(amount),
                    title: 'Monto registrado',
                  },
                ]}
              />
            </Descriptions.Item>

            <Descriptions.Item label="Notas">{payment.notes}</Descriptions.Item>
          </Descriptions>

          <Flex justify="end">
            <FormDeleteButton
              scope={ScopeEnum.PAYMENTS}
              onClick={() => {
                deletePayment.mutate({ id: payment.id });
              }}
            />
          </Flex>
        </>
      </Card>
    </>
  );
};
