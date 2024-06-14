import { FileExcelOutlined } from '@ant-design/icons';
import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryLabel,
  MemberStatusLabel,
} from '@domain/members/member.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { ExportButton } from '@ui/components/Button/ExportButton';
import { useGetMembersToExport } from '@ui/hooks/members/useGetMembersToExport';

interface Props {
  request: GetMembersGridRequestDto;
}

export const MembersGridCsvDownloaderButton: React.FC<Props> = ({
  request,
}) => {
  const getMembersToExport = useGetMembersToExport();

  return (
    <CsvDownloader
      columns={[
        {
          displayName: 'ID',
          id: 'id',
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
          displayName: 'Email',
          id: 'email',
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
      filename={`club-social-socios-al-${new DateVo().format(DateFormatEnum.DATE)}-${new DateVo().unix()}.csv`}
      // @ts-expect-error
      datas={async () => {
        const data = await getMembersToExport.mutateAsync(request);

        return data.map((member) => ({
          category: MemberCategoryLabel[member.category],
          email: member.email,
          id: member.id,
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
      <ExportButton
        loading={getMembersToExport.isLoading}
        disabled={getMembersToExport.isLoading}
        icon={<FileExcelOutlined />}
      >
        Exportar
      </ExportButton>
    </CsvDownloader>
  );
};
