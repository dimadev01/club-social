import { CreditCardOutlined, WalletOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Divider, Form, Space } from 'antd';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';

import { DueStatusEnum } from '@domain/dues/due.enum';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { DueAndPaymentBalanceTotals } from '@ui/components/Analytics/DueAndPaymentBalanceTotals';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';
import { Row } from '@ui/components/Layout/Row';
import { useDuesTotals } from '@ui/hooks/dues/useDuesTotals';
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

  const { data: duesTotals, isLoading: isLoadingDuesTotals } = useDuesTotals({
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

  const { data: paymentsTotals, isLoading: isLoadingPaymentsTotals } =
    usePaymentsTotals({
      filterByCreatedAt: [],
      filterByDate,
      filterByMember: [],
      filterByStatus: [PaymentStatusEnum.PAID],
    });

  return (
    <Card
      bordered
      title="Balance de Deudas y Pagos"
      extra={
        <Space split={<Divider type="vertical" />}>
          <WalletOutlined />
          <CreditCardOutlined />
        </Space>
      }
    >
      <Form.Item label="Fecha">
        <DatePicker.RangePicker
          presets={getPresets()}
          allowClear
          value={datePickerValue}
          onChange={(value) => setDatePickerValue(value as [Dayjs, Dayjs])}
        />
      </Form.Item>

      <Row>
        <Col xs={24} md={12}>
          <DueAndPaymentBalanceTotals
            isLoading={isLoadingDuesTotals}
            total={duesTotals?.total ?? 0}
            electricity={duesTotals?.electricity ?? 0}
            guest={duesTotals?.guest ?? 0}
            membership={duesTotals?.membership ?? 0}
            title="Deudas pendientes"
          />
        </Col>
        <Col xs={24} md={12}>
          <DueAndPaymentBalanceTotals
            isLoading={isLoadingPaymentsTotals}
            total={paymentsTotals?.total ?? 0}
            electricity={paymentsTotals?.electricity ?? 0}
            guest={paymentsTotals?.guest ?? 0}
            membership={paymentsTotals?.membership ?? 0}
            title="Pagos"
          />
        </Col>
      </Row>
    </Card>
  );
};
