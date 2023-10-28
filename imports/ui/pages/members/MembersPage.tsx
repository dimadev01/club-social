import React from 'react';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import { CategoryEnum } from '@domain/categories/category.enum';
import {
  getMemberCategoryFilters,
  getMemberFileStatusFilters,
  getMemberStatusFilters,
  MemberCategory,
  MemberCategoryLabel,
  MemberFileStatus,
  MemberFileStatusLabel,
  MemberStatus,
  MemberStatusLabel,
} from '@domain/members/members.enum';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useCategories } from '@ui/hooks/categories/useCategories';
import { useMembersGrid } from '@ui/hooks/members/useMembersGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MembersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'createdAt',
    sortOrder: 'descend',
  });

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { data, isLoading, isRefetching, refetch } = useMembersGrid({
    filters: gridState.filters,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  const membershipPrice =
    categories?.find(
      (category) => category.code === CategoryEnum.MembershipIncome
    )?.amount ?? 0;

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Socios',
          },
        ]}
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
            if (isLoadingCategories) {
              return '';
            }

            if (member.membershipBalance < membershipPrice * -1) {
              return 'bg-red-50';
            }

            return '';
          }}
          columns={[
            {
              dataIndex: 'name',
              render: (name: string, member: MemberGridDto) => (
                <NavLink to={`${AppUrl.Members}/${member._id}`}>{name}</NavLink>
              ),
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
              filteredValue: gridState.filters?.category ?? [],
              filters: getMemberCategoryFilters(),
              render: (category: MemberCategory | null) =>
                category && MemberCategoryLabel[category],
              title: 'Categoría',
            },
            {
              align: 'center',
              dataIndex: 'fileStatus',
              filteredValue: gridState.filters?.fileStatus ?? [],
              filters: getMemberFileStatusFilters(),
              render: (fileStatus: MemberFileStatus | null) =>
                fileStatus && MemberFileStatusLabel[fileStatus],
              title: 'Ficha',
            },
            {
              align: 'center',
              dataIndex: 'status',
              filteredValue: gridState.filters?.status ?? [],
              filters: getMemberStatusFilters(),
              render: (status: MemberStatus) => MemberStatusLabel[status],
              title: 'Estado',
            },
            {
              align: 'right',
              dataIndex: 'electricityBalance',
              render: (electricityBalance) =>
                CurrencyUtils.formatCents(electricityBalance),
              title: 'Saldo luz',
            },
            {
              align: 'right',
              dataIndex: 'guestBalance',
              render: (guestBalance) => CurrencyUtils.formatCents(guestBalance),
              title: 'Saldo invitado',
            },
            {
              align: 'right',
              dataIndex: 'membershipBalance',
              render: (membershipBalance) =>
                CurrencyUtils.formatCents(membershipBalance),
              title: 'Saldo cuota',
            },
          ]}
        />
      </Card>
    </>
  );
};
