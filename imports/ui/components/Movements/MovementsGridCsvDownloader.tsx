import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import {
  MovementCategoryLabel,
  MovementStatusLabel,
  MovementTypeEnum,
  MovementTypeLabel,
} from '@domain/categories/category.enum';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { ExportButton } from '@ui/components/Button/ExportButton';
import { GetMovementsGridRequestDto } from '@ui/dtos/get-movements-grid-request.dto';
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
      datas={async () => {
        const data = await getMovementsToExport.mutateAsync(request);

        return data.map((movement) => {
          let amount = Money.from({ amount: movement.amount }).toInteger();

          if (movement.type === MovementTypeEnum.EXPENSE) {
            amount *= -1;
          }

          return {
            amount,
            category: MovementCategoryLabel[movement.category],
            createdAt: new DateTimeVo(movement.createdAt).format(
              DateFormatEnum.DDMMYYHHmm,
            ),
            date: new DateVo(movement.date).format(DateFormatEnum.DDMMYYYY),
            id: movement.id,
            notes: movement.notes,
            status: MovementStatusLabel[movement.status],
            type: MovementTypeLabel[movement.type],
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
