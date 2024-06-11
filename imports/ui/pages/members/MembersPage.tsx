import {
  CreditCardOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
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
import { Button } from '@ui/components/Button/Button';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { MembersGridCsvDownloaderButton } from '@ui/components/Members/MembersGridCsvDownloader';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { useNavigate } from '@ui/hooks/ui/useNavigate';

export const MembersPage = () => {
  const navigate = useNavigate();

  const { gridState, onTableChange } = useTable<MemberGridDto>({
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
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Socios' }]}
      />

      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Socios</span>
          </Space>
        }
        extra={
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <MembersGridCsvDownloaderButton request={gridRequest} />
            <GridNewButton scope={ScopeEnum.MEMBERS} to={AppUrl.MembersNew} />
          </Space.Compact>
        }
      >
        <Grid<MemberGridDto>
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
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
                <Link to={`${AppUrl.Members}/${id}`}>{member.name}</Link>
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
                  <Button
                    type="text"
                    icon={<WalletOutlined />}
                    onClick={() =>
                      navigate(
                        UrlUtils.navigate(AppUrl.Dues, {
                          filters: { memberId: [member.id] },
                        }),
                      )
                    }
                    tooltip={{ title: 'Ver cobros' }}
                  />
                  <Button
                    type="text"
                    icon={<CreditCardOutlined />}
                    onClick={() =>
                      navigate(
                        UrlUtils.navigate(AppUrl.Payments, {
                          filters: { memberId: [member.id] },
                        }),
                      )
                    }
                    tooltip={{ title: 'Ver Pagos' }}
                  />
                </Space.Compact>
              ),
              title: 'Acciones',
              width: 100,
            },
          ]}
        />
      </Card>
    </>
  );
};
