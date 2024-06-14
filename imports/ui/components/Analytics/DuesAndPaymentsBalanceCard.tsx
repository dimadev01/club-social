import {
  CreditCardOutlined,
  SwapOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Card, Col, DatePicker, Divider, Form, Space } from 'antd';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';

import { MovementStatusEnum } from '@domain/categories/category.enum';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { DueAndPaymentBalanceTotals } from '@ui/components/Analytics/DueAndPaymentBalanceTotals';
import { MovementsCard } from '@ui/components/Analytics/MovementsCard';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';
import { Row } from '@ui/components/Layout/Row';
import { useDuesTotals } from '@ui/hooks/dues/useDuesTotals';
import { useMovementsTotals } from '@ui/hooks/movements/useMovementsTotals';
import { usePaymentsTotals } from '@ui/hooks/payments/usePaymentsTotals';

export const DuesAndPaymentsBalanceCard = () => {
  const [datePickerValue, setDatePickerValue] = useState<
    [Dayjs, Dayjs] | undefined
  >(undefined);

  const filterByDate = datePickerValue
    ? [
        datePickerValue?.[0].format(DateFormatEnum.DATE),
        datePickerValue?.[1].format(DateFormatEnum.DATE),
      ]
    : [];

  const { data: dues, isLoading: isLoadingDues } = useDuesTotals({
    filterByCategory: [],
    filterByCreatedAt: [],
    filterByDate,
    filterByMember: [],
    filterByStatus: [
      DueStatusEnum.PAID,
      DueStatusEnum.PENDING,
      DueStatusEnum.PARTIALLY_PAID,
    ],
  });

  const { data: payments, isLoading: isLoadingPayments } = usePaymentsTotals({
    filterByCreatedAt: [],
    filterByDate,
    filterByMember: [],
    filterByStatus: [PaymentStatusEnum.PAID],
  });

  const { data: movements, isLoading: isLoadingMovements } = useMovementsTotals(
    {
      filterByCategory: [],
      filterByCreatedAt: [],
      filterByDate,
      filterByStatus: [MovementStatusEnum.REGISTERED],
      filterByType: [],
    },
  );

  return (
    <Card
      bordered
      title="Balance de Deudas, Pagos y Movimientos"
      extra={
        <Space split={<Divider type="vertical" />}>
          <WalletOutlined />
          <CreditCardOutlined />
          <SwapOutlined />
        </Space>
      }
    >
      <Form.Item layout="vertical" label="Fecha">
        <DatePicker.RangePicker
          presets={getPresets()}
          allowClear
          value={datePickerValue}
          onChange={(value) => setDatePickerValue(value as [Dayjs, Dayjs])}
        />
      </Form.Item>

      <Row>
        <Col xs={24} sm={24} md={12} lg={8}>
          <DueAndPaymentBalanceTotals
            isLoading={isLoadingDues}
            total={dues?.total ?? 0}
            electricity={dues?.electricity ?? 0}
            guest={dues?.guest ?? 0}
            membership={dues?.membership ?? 0}
            title="Deudas"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <DueAndPaymentBalanceTotals
            isLoading={isLoadingPayments}
            total={payments?.total ?? 0}
            electricity={payments?.electricity ?? 0}
            guest={payments?.guest ?? 0}
            membership={payments?.membership ?? 0}
            title="Pagos"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <MovementsCard
            isLoading={isLoadingMovements}
            expense={movements?.expense ?? 0}
            income={movements?.income ?? 0}
            total={movements?.total ?? 0}
          />
        </Col>
      </Row>
    </Card>
  );
};
