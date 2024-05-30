import { FileExcelOutlined } from '@ant-design/icons';
import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetMembersGridRequestDto } from '@infra/controllers/types/get-members-grid-request.dto';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { Button } from '@ui/components/Button';
import { useMembersToExport } from '@ui/hooks/members/useGetMembersToExport';

interface Props {
  request: GetMembersGridRequestDto;
}

export const MembersGridCsvDownloaderButton: React.FC<Props> = ({
  request,
}) => {
  const getMembersToExport = useMembersToExport();

  return (
    <CsvDownloader
      columns={[
        {
          displayName: 'ID',
          id: '_id',
        },
        {
          displayName: 'Nombre',
          id: 'name',
        },
        // {
        //   displayName: 'Categoría',
        //   id: 'category',
        // },
        // {
        //   displayName: 'Estado',
        //   id: 'status',
        // },
        // {
        //   displayName: 'Emails',
        //   id: 'emails',
        // },
        // {
        //   displayName: 'Teléfono',
        //   id: 'phone',
        // },
        // {
        //   displayName: 'Deuda de luz',
        //   id: 'electricityDebt',
        // },
        // {
        //   displayName: 'Deuda de invitado',
        //   id: 'guestDebt',
        // },
        // {
        //   displayName: 'Deuda de cuota',
        //   id: 'membershipDebt',
        // },
        // {
        //   displayName: 'Deuda total',
        //   id: 'totalDebt',
        // },
      ]}
      filename={DateUtils.c().format(DateFormatEnum.DateTime)}
      datas={() => getMembersToExport.mutateAsync(request)}
    >
      <Button
        loading={getMembersToExport.isLoading}
        disabled={getMembersToExport.isLoading}
        tooltip={{ title: 'Descargar CSV' }}
        htmlType="button"
        type="text"
        icon={<FileExcelOutlined />}
      />
    </CsvDownloader>
  );
};
