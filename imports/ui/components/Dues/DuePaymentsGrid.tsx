import React from 'react';
import { Link } from 'react-router-dom';

import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  PaymentStatusEnum,
  PaymentStatusLabel,
} from '@domain/payments/payment.enum';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';

interface DuePaymentsGridProps {
  payments: DuePaymentDto[];
}

export const DuePaymentsGrid: React.FC<DuePaymentsGridProps> = ({
  payments,
}) => (
  <Table
    title={() => 'Pagos realizados'}
    rowKey="paymentId"
    columns={[
      {
        dataIndex: 'paymentDate',
        render: (paymentDate, duePayment) => (
          <Link to={`${AppUrl.PAYMENTS}/${duePayment.paymentId}`}>
            {new DateUtcVo(paymentDate).format()}
          </Link>
        ),
        title: 'Fecha',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'totalAmount',
        render: (amount) => new Money({ amount }).formatWithCurrency(),
        title: 'Monto Registrado',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'paymentReceiptNumber',
        title: 'Recibo #',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'paymentStatus',
        render: (status: PaymentStatusEnum) => PaymentStatusLabel[status],
        title: 'Estado',
        width: 150,
      },
    ]}
    dataSource={payments}
  />
);
