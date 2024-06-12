import { Card, DatePicker, Space, Statistic } from 'antd';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Money } from '@domain/common/value-objects/money.value-object';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';
import { usePaymentsTotals } from '@ui/hooks/payments/usePaymentsTotals';

export const PaymentsCard = () => {
  const [datePickerValue, setDatePickerValue] = useState<
    [Dayjs, Dayjs] | undefined
  >(undefined);

  const filterByDate = datePickerValue
    ? [
        datePickerValue?.[0].format(DateFormatEnum.DATE),
        datePickerValue?.[1].format(DateFormatEnum.DATE),
      ]
    : [];

  const { data, isLoading } = usePaymentsTotals({
    filterByCreatedAt: [],
    filterByDate,
    filterByMember: [],
    filterByStatus: [PaymentStatusEnum.PAID],
  });

  const renderStatisticValue = (value: number) => (
    <Link
      to={`${AppUrl.PAYMENTS}${UrlUtils.stringify({
        filters: {
          date: [filterByDate],
        },
      })}`}
    >
      {Money.fromNumber(value).format()}
    </Link>
  );

  return (
    <Card
      className="min-h-[285px]"
      bordered
      title="Pagos"
      extra={
        <DatePicker.RangePicker
          presets={getPresets()}
          allowClear
          className="w-full"
          value={datePickerValue}
          onChange={(value) => setDatePickerValue(value as [Dayjs, Dayjs])}
        />
      }
    >
      <Space size="large" direction="vertical" className="flex">
        <Statistic
          loading={isLoading}
          value={new Money({ amount: data?.totalAmount ?? 0 }).toInteger()}
          precision={0}
          formatter={(value) => renderStatisticValue(+value)}
          prefix="$"
        />
      </Space>
    </Card>
  );
};
