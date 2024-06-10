import { FileExcelFilled } from '@ant-design/icons';
import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import {
  MovementCategoryTypeLabel,
  MovementStatusLabel,
} from '@domain/categories/category.enum';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { Button } from '@ui/components/Button';
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

        return data.map((movement) => ({
          amount: new Money({ amount: movement.amount }).toInteger(),
          createdAt: new DateVo(movement.createdAt).format(
            DateFormatEnum.DDMMYYHHmm,
          ),
          date: new DateVo(movement.date).format(DateFormatEnum.DDMMYYHHmm),
          id: movement.id,
          notes: movement.notes,
          status: MovementStatusLabel[movement.status],
          type: MovementCategoryTypeLabel[movement.type],
        }));
      }}
    >
      <Button
        loading={getMovementsToExport.isLoading}
        disabled={getMovementsToExport.isLoading}
        tooltip={{ title: 'Descargar CSV' }}
        htmlType="button"
        icon={<FileExcelFilled />}
      >
        Exportar
      </Button>
    </CsvDownloader>
  );
};
