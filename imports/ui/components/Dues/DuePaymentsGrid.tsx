import { Table } from 'antd';
import React from 'react';

import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  PaymentStatusEnum,
  PaymentStatusLabel,
} from '@domain/payments/payment.enum';

interface DuePaymentsGridProps {
  payments: DuePaymentDto[];
}

export const DuePaymentsGrid: React.FC<DuePaymentsGridProps> = ({
  payments,
}) => (
  <Table
    title={() => 'Pagos realizados'}
    rowKey="paymentId"
    pagination={false}
    bordered
    size="small"
    columns={[
      {
        dataIndex: 'date',
        render: (date) => new DateUtcVo(date).format(),
        title: 'Fecha',
        width: 150,
      },
      {
        align: 'right',
        dataIndex: 'amount',
        render: (amount) => new Money({ amount }).formatWithCurrency(),
        title: 'Monto Registrado',
      },
      {
        align: 'right',
        dataIndex: 'receiptNumber',
        title: 'Recibo #',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'status',
        render: (status: PaymentStatusEnum) => PaymentStatusLabel[status],
        title: 'Estado',
        width: 150,
      },
    ]}
    dataSource={payments}
  />
);
