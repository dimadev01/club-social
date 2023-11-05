import React from 'react';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import {
  getMemberCategoryFilters,
  getMemberStatusFilters,
  MemberCategoryEnum,
  MemberCategoryLabel,
  MemberStatusEnum,
  MemberStatusLabel,
} from '@domain/members/member.enum';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembersGrid } from '@ui/hooks/members/useMembersGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MembersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useMembersGrid({
    filters: gridState.filters,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Socios' }]}
      />

      <Card
        title="Socios"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <TableNewButton to={AppUrl.MembersNew} />
          </>
        }
      >
        <Table<MemberGridDto>
          total={data?.count ?? 0}
          showSearch
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data}
          rowClassName={(member) => {
            if (member.membershipBalance < 0) {
              return 'bg-red-50';
            }

            if (member.membershipBalance > 0) {
              return 'bg-green-50';
            }

            return '';
          }}
          columns={[
            {
              dataIndex: 'name',
              defaultSortOrder:
                gridState.sortField === 'name'
                  ? gridState.sortOrder
                  : undefined,
              render: (name: string, member: MemberGridDto) => (
                <NavLink to={`${AppUrl.Members}/${member._id}`}>{name}</NavLink>
              ),
              sorter: true,
              title: 'Socio',
            },
            {
              dataIndex: 'emails',
              render: (emails: Meteor.UserEmail[] | null) =>
                emails && (
                  <Space direction="vertical">
                    {emails.map((email) => (
                      <Typography.Text
                        key={email.address}
                        copyable={{ text: email.address }}
                      >
                        <Tooltip
                          title={
                            email.verified
                              ? 'Email verificado'
                              : 'Email no verificado'
                          }
                          key={email.address}
                        >
                          {email.address}
                        </Tooltip>
                      </Typography.Text>
                    ))}
                  </Space>
                ),
              title: 'Emails',
            },
            {
              align: 'center',
              dataIndex: 'category',
              defaultFilteredValue: gridState.filters.category,
              filters: getMemberCategoryFilters(),
              render: (category: MemberCategoryEnum) =>
                MemberCategoryLabel[category],
              title: 'Categoría',
            },
            {
              align: 'center',
              dataIndex: 'status',
              defaultFilteredValue: gridState.filters.status,
              filters: getMemberStatusFilters(),
              render: (status: MemberStatusEnum) => MemberStatusLabel[status],
              title: 'Estado',
            },
            {
              align: 'right',
              dataIndex: 'electricityBalance',
              defaultSortOrder:
                gridState.sortField === 'electricityBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (electricityBalance) =>
                CurrencyUtils.formatCents(electricityBalance),
              sorter: true,
              title: 'Saldo luz',
            },
            {
              align: 'right',
              dataIndex: 'guestBalance',
              defaultSortOrder:
                gridState.sortField === 'guestBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (guestBalance) => CurrencyUtils.formatCents(guestBalance),
              sorter: true,
              title: 'Saldo invitado',
            },
            {
              align: 'right',
              dataIndex: 'membershipBalance',
              defaultSortOrder:
                gridState.sortField === 'membershipBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (membershipBalance) =>
                CurrencyUtils.formatCents(membershipBalance),
              sorter: true,
              title: 'Saldo cuota',
            },
          ]}
        />
      </Card>
    </>
  );
};
