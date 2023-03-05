import React from 'react';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
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
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembersGrid } from '@ui/hooks/members/useMembersGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MembersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'createdAt',
    sortOrder: 'descend',
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
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Socios</Breadcrumb.Item>
      </Breadcrumb>

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
          ]}
        />
      </Card>
    </>
  );
};
