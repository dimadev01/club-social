import { Descriptions, Skeleton } from 'antd';
import React from 'react';

import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';

type Props = {
  electricity: number;
  guest: number;
  isLoading: boolean;
  membership: number;
  title: string;
  total: number;
};

export const DueAndPaymentBalanceTotals: React.FC<Props> = ({
  electricity,
  guest,
  isLoading,
  membership,
  title,
  total,
}) => {
  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Descriptions
      bordered
      size="small"
      column={1}
      layout="horizontal"
      title={title}
    >
      <Descriptions.Item
        labelStyle={{ textAlign: 'right' }}
        label={DueCategoryLabel[DueCategoryEnum.MEMBERSHIP]}
        className="text-right"
      >
        {Money.from({ amount: membership }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        labelStyle={{ textAlign: 'right' }}
        label={DueCategoryLabel[DueCategoryEnum.ELECTRICITY]}
        className="text-right"
      >
        {Money.from({ amount: electricity }).formatWithCurrency()}
      </Descriptions.Item>
      <Descriptions.Item
        labelStyle={{ textAlign: 'right' }}
        label={DueCategoryLabel[DueCategoryEnum.GUEST]}
        className="text-right"
      >
        {Money.from({ amount: guest }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        label="Total"
        labelStyle={{ fontWeight: 'bold', textAlign: 'right' }}
        className="text-right font-bold"
      >
        {Money.from({ amount: total }).formatWithCurrency()}
      </Descriptions.Item>
    </Descriptions>
  );
};
