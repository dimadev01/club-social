import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { Progress, Statistic, theme } from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { useDueCollectionRate } from '@/home/useDueCollectionRate';
import { Card } from '@/ui';

export function CollectionRateCard() {
  const [searchParams] = useSearchParams();

  const dateRange = useMemo<[string, string] | undefined>(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate === '' || !startDate || !endDate) {
      return undefined;
    }

    const start = DateFormat.parse(startDate);
    const end = DateFormat.parse(endDate);

    if (!start.isValid() || !end.isValid()) {
      return undefined;
    }

    return [DateFormat.isoDate(start), DateFormat.isoDate(end)];
  }, [searchParams]);

  const { data, isLoading } = useDueCollectionRate(
    dateRange ? { dateRange } : undefined,
  );
  const { token } = theme.useToken();

  return (
    <Card loading={isLoading} title="Tasa de cobranza">
      {data && (
        <div className="flex flex-col items-center gap-4">
          <Progress
            percent={data.collectionRate}
            strokeColor={token.colorSuccess}
            type="circle"
          />

          <div className="grid w-full grid-cols-3 gap-2 text-center">
            <Statistic
              styles={{ content: { color: token.colorSuccess, fontSize: 18 } }}
              title="Pagadas"
              value={data.paidDues}
            />
            <Statistic
              styles={{ content: { color: token.colorWarning, fontSize: 18 } }}
              title="Parciales"
              value={data.partiallyPaidDues}
            />
            <Statistic
              styles={{ content: { color: token.colorError, fontSize: 18 } }}
              title="Pendientes"
              value={data.pendingDues}
            />
          </div>

          <div className="grid w-full grid-cols-2 gap-2 text-center">
            <Statistic
              styles={{ content: { fontSize: 14 } }}
              title="Cobrado"
              value={NumberFormat.currencyCents(data.collectedAmount)}
            />
            <Statistic
              styles={{ content: { color: token.colorError, fontSize: 14 } }}
              title="Pendiente"
              value={NumberFormat.currencyCents(data.pendingAmount)}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
