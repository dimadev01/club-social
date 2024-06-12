import { CreditCardOutlined } from '@ant-design/icons';
import {
  Card,
  DatePicker,
  Descriptions,
  Form,
  Skeleton,
  Space,
  Statistic,
} from 'antd';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
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

  const renderDescriptionItem = (
    category: DueCategoryEnum,
    amount?: number,
  ) => (
    <Descriptions.Item label={DueCategoryLabel[category]}>
      {isLoading && <Skeleton.Input />}

      {!isLoading && 'Pronto'}
    </Descriptions.Item>
  );

  return (
    <Card bordered title="Pagos" extra={<CreditCardOutlined />}>
      <Form.Item label="Fecha de pago">
        <DatePicker.RangePicker
          presets={getPresets()}
          allowClear
          value={datePickerValue}
          onChange={(value) => setDatePickerValue(value as [Dayjs, Dayjs])}
        />
      </Form.Item>

      <Space direction="vertical" className="flex" size="middle">
        <Statistic
          loading={isLoading}
          value={new Money({ amount: data?.totalAmount ?? 0 }).toInteger()}
          precision={0}
          formatter={(value) => renderStatisticValue(+value)}
          prefix="$"
        />

        <Descriptions bordered size="small" column={1} layout="horizontal">
          {renderDescriptionItem(
            DueCategoryEnum.MEMBERSHIP,
            data?.pendingMembership,
          )}
          {renderDescriptionItem(
            DueCategoryEnum.ELECTRICITY,
            data?.pendingElectricity,
          )}
          {renderDescriptionItem(DueCategoryEnum.GUEST, data?.pendingGuest)}
        </Descriptions>
      </Space>
    </Card>
  );
};
