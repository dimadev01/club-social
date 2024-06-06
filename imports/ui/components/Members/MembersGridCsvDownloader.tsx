import { FileExcelOutlined } from '@ant-design/icons';
import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryLabel,
  MemberStatusLabel,
} from '@domain/members/member.enum';
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
          _id: member.id,
          category: MemberCategoryLabel[member.category],
          name: member.name,
          pendingElectricity: new Money({
            amount: member.pendingElectricity,
          }).toInteger(),
          pendingGuest: new Money({ amount: member.pendingGuest }).toInteger(),
          pendingMembership: new Money({
            amount: member.pendingMembership,
          }).toInteger(),
          pendingTotal: new Money({ amount: member.pendingTotal }).toInteger(),
          status: MemberStatusLabel[member.status],
        }));
      }}
    >
      <Button
        loading={getMembersToExport.isLoading}
        disabled={getMembersToExport.isLoading}
        tooltip={{ title: 'Descargar CSV' }}
        htmlType="button"
        icon={<FileExcelOutlined />}
      >
        Exportar
      </Button>
    </CsvDownloader>
  );
};
