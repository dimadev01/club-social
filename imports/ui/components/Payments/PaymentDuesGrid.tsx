import React from 'react';
import { Link } from 'react-router-dom';

import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { AppUrl } from '@ui/app.enum';
import { DueCategoryIconWithLabel } from '@ui/components/Dues/DueCategoryLabel';
import { Table } from '@ui/components/Table/Table';

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
          <Link to={`/${AppUrl.DUES}/${paymentDue.dueId}`}>
            {new DateVo(dueDate).format()}
          </Link>
        ),
        title: 'Fecha',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'dueCategory',
        render: (dueCategory: DueCategoryEnum, paymentDue) => (
          <DueCategoryIconWithLabel
            category={dueCategory}
            date={paymentDue.dueDate}
          />
        ),
        title: 'Categoría',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'dueAmount',
        render: (dueAmount) =>
          Money.from({ amount: dueAmount }).formatWithCurrency(),
        title: 'Monto original',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'duePendingAmount',
        render: (amount) => Money.from({ amount }).formatWithCurrency(),
        title: 'Monto pendiente',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'totalAmount',
        render: (amount) => Money.from({ amount }).formatWithCurrency(),
        title: 'Monto registrado',
        width: 150,
      },
    ]}
    dataSource={dues}
  />
);
