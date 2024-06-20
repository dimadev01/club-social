import React from 'react';
import CsvDownloader from 'react-csv-downloader';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryLabel,
  MemberStatusLabel,
} from '@domain/members/member.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { ExportButton } from '@ui/components/Button/ExportButton';
import { ExportCsvIcon } from '@ui/components/Icons/ExportCsvIcon';
import { GetMembersGridRequestDto } from '@ui/dtos/get-members-grid-request.dto';
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
      filename={`club-social-socios-al-${new DateTimeVo().format(DateFormatEnum.DATE)}-${new DateTimeVo().unix()}.csv`}
      // @ts-expect-error
      datas={async () => {
        const data = await getMembersToExport.mutateAsync(request);

        return data.map((member) => ({
          category: MemberCategoryLabel[member.category],
          email: member.email,
          id: member.id,
          name: member.name,
          pendingElectricity: Money.from({
            amount: member.pendingElectricity,
          }).toInteger(),
          pendingGuest: Money.from({ amount: member.pendingGuest }).toInteger(),
          pendingMembership: Money.from({
            amount: member.pendingMembership,
          }).toInteger(),
          pendingTotal: Money.from({ amount: member.pendingTotal }).toInteger(),
          status: MemberStatusLabel[member.status],
        }));
      }}
    >
      <ExportButton
        loading={getMembersToExport.isLoading}
        disabled={getMembersToExport.isLoading}
        icon={<ExportCsvIcon />}
      >
        Exportar
      </ExportButton>
    </CsvDownloader>
  );
};
