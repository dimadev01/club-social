import { Table } from 'antd';
import React from 'react';

import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { useDuesByPayment } from '@ui/hooks/dues/useDuesByPayment';

interface PaymentDuesGridProps {
  payment: PaymentGridDto;
}

export const PaymentDuesGrid: React.FC<PaymentDuesGridProps> = ({
  payment,
}) => {
  const { data: dues, isLoading } = useDuesByPayment({ paymentId: payment.id });

  return (
    <Table
      rowKey="dueId"
      pagination={false}
      loading={isLoading}
      bordered
      columns={[
        {
          render: (_, paymentDue) => {
            const due = dues?.find((d) => d.id === paymentDue.dueId);

            if (!due) {
              return null;
            }

            return new DateUtcVo(due.date).format();
          },
          title: 'Fecha',
          width: 150,
        },
        {
          align: 'center',
          dataIndex: 'category',
          render: (_, paymentDue) => {
            const due = dues?.find((d) => d.id === paymentDue.dueId);

            if (!due) {
              return null;
            }

            if (due.category === DueCategoryEnum.MEMBERSHIP) {
              return `${DueCategoryLabel[due.category]} (${new DateUtcVo(due.date).monthName()})`;
            }

            return DueCategoryLabel[due.category];
          },
          title: 'Categoría',
        },
        {
          align: 'right',
          dataIndex: 'amount',
          render: (_, paymentDue) => {
            const due = dues?.find((d) => d.id === paymentDue.dueId);

            if (!due) {
              return null;
            }

            return new Money({ amount: due.amount }).formatWithCurrency();
          },
          title: 'Deuda',
        },
        {
          align: 'right',
          dataIndex: 'amount',
          render: (amount) => new Money({ amount }).formatWithCurrency(),
          title: 'Monto Registrado',
        },
      ]}
      dataSource={payment.paymentDues}
    />
  );
};
