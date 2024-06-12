import { Card, Statistic } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { MovementStatusEnum } from '@domain/categories/category.enum';
import { Money } from '@domain/common/value-objects/money.value-object';
import { AppUrl } from '@ui/app.enum';
import { useMovementsTotals } from '@ui/hooks/movements/useMovementsTotals';

export const MovementsCard = () => {
  const { data, isLoading } = useMovementsTotals({
    filterByCategory: [],
    filterByCreatedAt: [],
    filterByDate: [],
    filterByStatus: [MovementStatusEnum.REGISTERED],
    filterByType: [],
  });

  const renderStatisticValue = (value: number) => (
    <Link to={AppUrl.MOVEMENTS}>{Money.fromNumber(value).format()}</Link>
  );

  return (
    <Card title="Caja" bordered>
      <Statistic
        loading={isLoading}
        value={new Money({ amount: data?.amount ?? 0 }).toInteger()}
        formatter={(value) => renderStatisticValue(+value)}
        precision={0}
        prefix="$"
      />
    </Card>
  );
};
