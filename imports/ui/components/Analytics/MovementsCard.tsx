import { Descriptions, Skeleton } from 'antd';
import React from 'react';

import {
  MovementTypeEnum,
  MovementTypeLabel,
} from '@domain/categories/category.enum';
import { Money } from '@domain/common/value-objects/money.value-object';

type Props = {
  expense: number;
  income: number;
  isLoading: boolean;
  total: number;
};

export const MovementsCard: React.FC<Props> = ({
  expense,
  income,
  total,
  isLoading,
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
      title="Movimientos"
    >
      <Descriptions.Item
        labelStyle={{ textAlign: 'right' }}
        label={MovementTypeLabel[MovementTypeEnum.INCOME]}
        className="text-right"
      >
        {new Money({ amount: income }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        labelStyle={{ textAlign: 'right' }}
        label={MovementTypeLabel[MovementTypeEnum.EXPENSE]}
        className="text-right"
      >
        {new Money({ amount: expense }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        labelStyle={{ textAlign: 'right' }}
        label="Total (Caja)"
        className="text-right"
      >
        {new Money({ amount: total }).formatWithCurrency()}
      </Descriptions.Item>
    </Descriptions>
  );
};
