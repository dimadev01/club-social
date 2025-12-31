import type { Dayjs } from 'dayjs';

import { DueCategoryLabel, DueCategorySorted } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { Statistic } from 'antd';

import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { Card } from '@/ui/Card';
import { DuesIcon } from '@/ui/Icons/DuesIcon';

import { useDuePendingStatistics } from '../useDuePendingStatistics';

interface Props {
  dateRange: [Dayjs, Dayjs] | null;
}

export function DuePendingStatisticsCard({ dateRange }: Props) {
  const { data, isLoading } = useDuePendingStatistics({
    dateRange: dateRange
      ? [DateFormat.isoDate(dateRange[0]), DateFormat.isoDate(dateRange[1])]
      : undefined,
  });

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
            prefix={DueCategoryIconMap[category]}
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
