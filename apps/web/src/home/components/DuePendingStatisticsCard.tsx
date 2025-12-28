import { DueCategoryLabel, DueCategorySorted } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Statistic } from 'antd';

import { CategoryIconMap } from '@/dues/DueCategoryIconMap';
import { Card } from '@/ui/Card';
import { DuesIcon } from '@/ui/Icons/DuesIcon';

import { useDuePendingStatistics } from '../useDuePendingStatistics';

export function DuePendingStatisticsCard() {
  const { data, isLoading } = useDuePendingStatistics();

  return (
    <Card
      extra={<DuesIcon />}
      size="small"
      title="Deudas pendientes"
      type="inner"
    >
      {DueCategorySorted.map((category) => (
        <Card.Grid className="w-full md:w-1/3" key={category}>
          <Statistic
            loading={isLoading}
            prefix={CategoryIconMap[category]}
            title={DueCategoryLabel[category]}
            value={NumberFormat.formatCurrencyCents(
              data?.categories[category] ?? 0,
            )}
          />
        </Card.Grid>
      ))}
      <Card.Grid className="w-full">
        <Statistic
          loading={isLoading}
          title="Total"
          value={NumberFormat.formatCurrencyCents(data?.total ?? 0)}
        />
      </Card.Grid>
    </Card>
  );
}
