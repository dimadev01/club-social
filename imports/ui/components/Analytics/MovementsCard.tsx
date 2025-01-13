import { InfoCircleOutlined } from '@ant-design/icons';
import { Descriptions, Skeleton, Tooltip } from 'antd';
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
  subtotal: number;
  total: number;
};

export const MovementsCard: React.FC<Props> = ({
  expense,
  income,
  total,
  subtotal,
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
        styles={{ label: { textAlign: 'right' } }}
        label={MovementTypeLabel[MovementTypeEnum.INCOME]}
        className="text-right"
      >
        {Money.from({ amount: income }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        styles={{ label: { textAlign: 'right' } }}
        label={MovementTypeLabel[MovementTypeEnum.EXPENSE]}
        className="text-right"
      >
        {Money.from({ amount: expense }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        styles={{ label: { textAlign: 'right' } }}
        label="Sub Total"
        className="text-right"
      >
        {Money.from({ amount: subtotal }).formatWithCurrency()}
      </Descriptions.Item>

      <Descriptions.Item
        styles={{ label: { textAlign: 'right' } }}
        label={
          <span>
            Total (Caja){' '}
            <sup>
              <Tooltip title="Incluye saldo de caja al día de cierre del filtro del período">
                <InfoCircleOutlined />
              </Tooltip>
            </sup>
          </span>
        }
        className="text-right"
      >
        {Money.from({ amount: total }).formatWithCurrency()}
      </Descriptions.Item>
    </Descriptions>
  );
};
