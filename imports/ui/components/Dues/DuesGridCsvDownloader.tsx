import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid-request.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel, DueStatusLabel } from '@domain/dues/due.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { ExportButton } from '@ui/components/Button/ExportButton';
import { useGetDuesToExport } from '@ui/hooks/dues/useGetDuesToExport';

interface Props {
  request: GetDuesGridRequestDto;
}

export const DuesGridCsvDownloaderButton: React.FC<Props> = ({ request }) => {
  const getDuesToExport = useGetDuesToExport();

  return (
    <CsvDownloader
      columns={[
        {
          displayName: 'ID',
          id: 'id',
        },
        {
          displayName: 'Fecha de creación',
          id: 'createdAt',
        },
        {
          displayName: 'Fecha de movimiento',
          id: 'date',
        },
        {
          displayName: 'Socio',
          id: 'memberName',
        },
        {
          displayName: 'Categoría',
          id: 'category',
        },
        {
          displayName: 'Monto',
          id: 'amount',
        },
        {
          displayName: 'Monto pago',
          id: 'totalPaidAmount',
        },
        {
          displayName: 'Monto pendiente',
          id: 'totalPendingAmount',
        },
        {
          displayName: 'Estado',
          id: 'status',
        },
      ]}
      filename={`club-social-movimientos-al-${DateUtils.c().format(DateFormatEnum.DATE)}-${DateUtils.c().unix()}.csv`}
      // @ts-expect-error
      datas={async () => {
        const data = await getDuesToExport.mutateAsync(request);

        return data.map((due) => ({
          amount: new Money({ amount: due.amount }).toInteger(),
          category: DueCategoryLabel[due.category],
          createdAt: new DateVo(due.createdAt).format(
            DateFormatEnum.DDMMYYHHmm,
          ),
          date: new DateUtcVo(due.date).format(DateFormatEnum.DDMMYYYY),
          id: due.id,
          memberName: due.member.name,
          status: DueStatusLabel[due.status],
          totalPaidAmount: new Money({
            amount: due.totalPaidAmount,
          }).toInteger(),
          totalPendingAmount: new Money({
            amount: due.totalPendingAmount,
          }).toInteger(),
        }));
      }}
    >
      <ExportButton
        loading={getDuesToExport.isLoading}
        disabled={getDuesToExport.isLoading}
      >
        Exportar
      </ExportButton>
    </CsvDownloader>
  );
};
