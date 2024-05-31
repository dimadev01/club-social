import { FileExcelOutlined } from '@ant-design/icons';
import { GetMembersGridRequestDto } from '@infra/controllers/types/get-members-grid-request.dto';
import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { Money } from '@application/value-objects/money.value-object';
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
        {
          displayName: 'Categoría',
          id: 'category',
        },
        {
          displayName: 'Estado',
          id: 'status',
        },
        {
          displayName: 'Deuda de cuota',
          id: 'pendingMembership',
        },
        {
          displayName: 'Deuda de invitado',
          id: 'pendingGuest',
        },
        {
          displayName: 'Deuda de luz',
          id: 'pendingElectricity',
        },
        {
          displayName: 'Deuda total',
          id: 'pendingTotal',
        },
      ]}
      filename={`club-social-socios-al-${DateUtils.c().format(DateFormatEnum.DATE)}-${DateUtils.c().unix()}.csv`}
      // @ts-expect-error
      datas={async () => {
        const data = await getMembersToExport.mutateAsync(request);

        return data.map((member) => ({
          ...member,
          pendingElectricity: new Money(member.pendingElectricity).toInteger(),
          pendingGuest: new Money(member.pendingGuest).toInteger(),
          pendingMembership: new Money(member.pendingMembership).toInteger(),
          pendingTotal: new Money(member.pendingTotal).toInteger(),
        }));
      }}
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
