import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import {
  MovementCategoryLabel,
  MovementCategoryTypeLabel,
  MovementStatusLabel,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { ExportButton } from '@ui/components/Button/ExportButton';
import { useGetMovementsToExport } from '@ui/hooks/movements/useGetMovementsToExport';

interface Props {
  request: GetMovementsGridRequestDto;
}

export const MovementsGridCsvDownloaderButton: React.FC<Props> = ({
  request,
}) => {
  const getMovementsToExport = useGetMovementsToExport();

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
          displayName: 'Categoría',
          id: 'category',
        },
        {
          displayName: 'Tipo',
          id: 'type',
        },
        {
          displayName: 'Monto',
          id: 'amount',
        },
        {
          displayName: 'Estado',
          id: 'status',
        },
        {
          displayName: 'Notas',
          id: 'notes',
        },
      ]}
      filename={`club-social-movimientos-al-${DateUtils.c().format(DateFormatEnum.DATE)}-${DateUtils.c().unix()}.csv`}
      // @ts-expect-error
      datas={async () => {
        const data = await getMovementsToExport.mutateAsync(request);

        return data.map((movement) => {
          let amount = new Money({ amount: movement.amount }).toInteger();

          if (movement.type === MovementTypeEnum.EXPENSE) {
            amount *= -1;
          }

          return {
            amount,
            category: MovementCategoryLabel[movement.category],
            createdAt: new DateVo(movement.createdAt).format(
              DateFormatEnum.DDMMYYHHmm,
            ),
            date: new DateUtcVo(movement.date).format(DateFormatEnum.DDMMYYYY),
            id: movement.id,
            notes: movement.notes,
            status: MovementStatusLabel[movement.status],
            type: MovementCategoryTypeLabel[movement.type],
          };
        });
      }}
    >
      <ExportButton
        loading={getMovementsToExport.isLoading}
        disabled={getMovementsToExport.isLoading}
      >
        Exportar
      </ExportButton>
    </CsvDownloader>
  );
};
