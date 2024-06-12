import { WalletOutlined } from '@ant-design/icons';
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
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusEnum,
} from '@domain/dues/due.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';
import { useDuesTotals } from '@ui/hooks/dues/useDuesTotals';

export const DuesCard = () => {
  const [datePickerValue, setDatePickerValue] = useState<
    [Dayjs, Dayjs] | undefined
  >(undefined);

  const filterByDate = datePickerValue
    ? [
        datePickerValue?.[0].format(DateFormatEnum.DATE),
        datePickerValue?.[1].format(DateFormatEnum.DATE),
      ]
    : [];

  const { data, isLoading } = useDuesTotals({
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

  const renderStatisticValue = (value: number) => (
    <Link
      to={`${AppUrl.DUES}${UrlUtils.stringify({
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

      {!isLoading && (
        <Link
          to={`${AppUrl.DUES}${UrlUtils.stringify({
            filters: {
              category: [category],
              date: [filterByDate],
            },
          })}`}
        >
          {new Money({ amount }).formatWithCurrency()}
        </Link>
      )}
    </Descriptions.Item>
  );

  return (
    <Card bordered title="Deudas" extra={<WalletOutlined />}>
      <Form.Item label="Fecha de cobro">
        <DatePicker.RangePicker
          presets={getPresets()}
          allowClear
          className="w-full"
          value={datePickerValue}
          onChange={(value) => setDatePickerValue(value as [Dayjs, Dayjs])}
        />
      </Form.Item>

      <Space className="flex" direction="vertical" size="middle">
        <Statistic
          value={new Money({ amount: data?.pendingTotal ?? 0 }).toInteger()}
          loading={isLoading}
          formatter={(value) => renderStatisticValue(+value)}
          precision={0}
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
