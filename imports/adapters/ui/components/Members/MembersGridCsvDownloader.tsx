import { FileExcelOutlined } from '@ant-design/icons';
import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetMembersGridRequestDto } from '@adapters/members/dtos/get-members-grid-request.dto';
import { Button } from '@adapters/ui/components/Button';
import { useMembersToExport } from '@adapters/ui/hooks/members/useGetMembersToExport';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryLabel,
  MemberStatusLabel,
} from '@domain/members/member.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

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
          _id: member._id,
          category: MemberCategoryLabel[member.category],
          name: member.name,
          pendingElectricity: new Money(member.pendingElectricity).toInteger(),
          pendingGuest: new Money(member.pendingGuest).toInteger(),
          pendingMembership: new Money(member.pendingMembership).toInteger(),
          pendingTotal: new Money(member.pendingTotal).toInteger(),
          status: MemberStatusLabel[member.status],
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
