import { Table } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { AppUrl } from '@ui/app.enum';

interface PaymentDuesGridProps {
  dues: PaymentDueDto[];
}

export const PaymentDuesGrid: React.FC<PaymentDuesGridProps> = ({ dues }) => (
  <Table
    title={() => 'Deudas pagas'}
    rowKey="dueId"
    pagination={false}
    bordered
    size="small"
    columns={[
      {
        dataIndex: 'dueDate',
        render: (dueDate, paymentDue) => (
          <Link to={`${AppUrl.Dues}/${paymentDue.dueId}`}>
            {new DateUtcVo(dueDate).format()}
          </Link>
        ),
        title: 'Fecha',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'dueCategory',
        render: (dueCategory: DueCategoryEnum, paymentDue) => {
          if (dueCategory === DueCategoryEnum.MEMBERSHIP) {
            return `${DueCategoryLabel[dueCategory]} (${new DateUtcVo(paymentDue.dueDate).monthName()})`;
          }

          return DueCategoryLabel[dueCategory];
        },
        title: 'Categoría',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'dueAmount',
        render: (dueAmount) =>
          new Money({ amount: dueAmount }).formatWithCurrency(),
        title: 'Deuda',
      },
      {
        align: 'right',
        dataIndex: 'amount',
        render: (amount) => new Money({ amount }).formatWithCurrency(),
        title: 'Monto Registrado',
        width: 150,
      },
    ]}
    dataSource={dues}
  />
);
