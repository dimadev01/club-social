import { Card, Space } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryEnum,
  MemberCategoryLabel,
  MemberStatusEnum,
  MemberStatusLabel,
  getMemberCategoryColumnFilters,
  getMemberStatusColumnFilters,
} from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { Button } from '@ui/components/Button/Button';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useGrid } from '@ui/components/Grid/useGrid';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { PaymentsIcon } from '@ui/components/Icons/PaymentsIcon';
import { UsersIcon } from '@ui/components/Icons/UsersIcon';
import { MembersGridCsvDownloaderButton } from '@ui/components/Members/MembersGridCsvDownloader';
import { GetMembersGridRequestDto } from '@ui/dtos/get-members-grid-request.dto';
import { usePermissions } from '@ui/hooks/auth/usePermissions';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';

export const MembersPage = () => {
  const navigate = useNavigate();

  const permissions = usePermissions();

  const { gridState, onTableChange, resetFilters, clearFilters } =
    useGrid<MemberGridDto>({
      defaultFilters: {
        category: [],
        id: [],
        pendingTotal: [],
        status: [MemberStatusEnum.ACTIVE],
      },
      defaultSorter: { id: 'ascend' },
    });

  const { data: members } = useMembers();

  const sorter = { ...gridState.sorter };

  if (sorter.id) {
    sorter.lastName = sorter.id;

    sorter.firstName = sorter.id;

    delete sorter.id;
  }

  const gridRequest: GetMembersGridRequestDto = {
    filterByCategory: gridState.filters.category as MemberCategoryEnum[],
    filterByDebtStatus: gridState.filters.pendingTotal,
    filterById: gridState.filters.id,
    filterByStatus: gridState.filters.status as MemberStatusEnum[],
    limit: gridState.pageSize,
    page: gridState.page,
    sorter,
  };

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetMembersGridRequestDto,
    MemberGridDto
  >({
    methodName: MeteorMethodEnum.MembersGetGrid,
    request: gridRequest,
  });

  return (
    <Card
      title={
        <Space>
          <UsersIcon />
          <span>Socios</span>
        </Space>
      }
      extra={
        <Space.Compact>
          <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
          <MembersGridCsvDownloaderButton request={gridRequest} />
          <GridNewButton scope={ScopeEnum.MEMBERS} />
        </Space.Compact>
      }
    >
      <Grid<MemberGridDto>
        total={data?.totalCount}
        state={gridState}
        onTableChange={onTableChange}
        loading={isLoading}
        dataSource={data?.items}
        clearFilters={clearFilters}
        resetFilters={resetFilters}
        rowClassName={(member) => {
          if (member.pendingTotal > 0) {
            return 'bg-red-100 dark:bg-red-900';
          }

          return '';
        }}
        columns={[
          {
            dataIndex: 'id',
            ellipsis: true,
            filterSearch: true,
            filteredValue: gridState.filters.id,
            filters: GridUtils.getMembersForFilter(members),
            fixed: 'left',
            render: (id: string, member: MemberGridDto) => (
              <Link to={id} state={gridState}>
                {member.name}
              </Link>
            ),
            sortOrder: gridState.sorter.id,
            sorter: true,
            title: 'Socio',
            width: 200,
          },
          {
            align: 'center',
            dataIndex: 'category',
            ellipsis: true,

            filteredValue: gridState.filters.category,
            filters: getMemberCategoryColumnFilters(),
            render: (category: MemberCategoryEnum) =>
              MemberCategoryLabel[category],
            title: 'Categoría',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'status',
            defaultFilteredValue: [MemberStatusEnum.ACTIVE],
            ellipsis: true,
            filterResetToDefaultFilteredValue: true,
            filteredValue: gridState.filters.status,
            filters: getMemberStatusColumnFilters(),
            render: (status: MemberStatusEnum) => MemberStatusLabel[status],
            title: 'Estado',
            width: 100,
          },
          {
            align: 'left',
            dataIndex: 'email',
            ellipsis: true,
            title: 'Email',
            width: 150,
          },
          {
            align: 'right',
            dataIndex: 'pendingMembership',
            ellipsis: true,
            render: (pendingMembership: number) =>
              new Money({ amount: pendingMembership }).formatWithCurrency(),
            sortOrder: gridState.sorter.pendingMembership,
            sorter: true,
            title: 'Deuda Cuota',
            width: 125,
          },
          {
            align: 'right',
            dataIndex: 'pendingElectricity',
            ellipsis: true,
            render: (pendingElectricity: number) =>
              new Money({ amount: pendingElectricity }).formatWithCurrency(),
            sortOrder: gridState.sorter.pendingElectricity,
            sorter: true,
            title: 'Deuda Luz',
            width: 125,
          },
          {
            align: 'right',
            dataIndex: 'pendingGuest',
            ellipsis: true,
            render: (pendingGuest: number) =>
              new Money({ amount: pendingGuest }).formatWithCurrency(),
            sortOrder: gridState.sorter.pendingGuest,
            sorter: true,
            title: 'Deuda Invitado',
            width: 125,
          },
          {
            align: 'right',
            dataIndex: 'pendingTotal',
            ellipsis: true,
            filterMultiple: false,
            filteredValue: gridState.filters.pendingTotal,
            filters: [
              {
                text: 'Con deuda',
                value: 'true',
              },
              {
                text: 'Sin deuda',
                value: 'false',
              },
            ],
            render: (pendingTotal: number) =>
              new Money({ amount: pendingTotal }).formatWithCurrency(),
            sortOrder: gridState.sorter.pendingTotal,
            sorter: true,
            title: 'Deuda Total',
            width: 125,
          },
          {
            align: 'center',
            ellipsis: true,
            render: (_, member: MemberGridDto) => (
              <Space.Compact size="small">
                {permissions.dues.read && (
                  <Button
                    type="text"
                    icon={<DuesIcon />}
                    onClick={() =>
                      navigate(
                        `/${AppUrl.DUES}${UrlUtils.stringify({
                          filters: {
                            memberId: [member.id],
                          },
                        })}`,
                      )
                    }
                    tooltip={{ title: 'Ver deudas' }}
                  />
                )}

                {permissions.payments.read && (
                  <Button
                    type="text"
                    icon={<PaymentsIcon />}
                    onClick={() =>
                      navigate(
                        `/${AppUrl.PAYMENTS}${UrlUtils.stringify({
                          filters: {
                            memberId: [member.id],
                          },
                        })}`,
                      )
                    }
                    tooltip={{ title: 'Ver Pagos' }}
                  />
                )}
              </Space.Compact>
            ),
            title: 'Acciones',
            width: 100,
          },
        ]}
      />
    </Card>
  );
};
