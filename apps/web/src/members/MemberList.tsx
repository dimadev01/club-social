import {
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  type IMemberPaginatedDto,
  MemberCategory,
  MemberCategoryLabel,
} from '@club-social/shared/members';
import { type PaginatedResponse } from '@club-social/shared/types';
import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { DuesIcon } from '@/ui/Icons/DuesIcon';
import { PaymentsIcon } from '@/ui/Icons/PaymentsIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

import { useMembersForSelect } from './useMembersForSelect';

export function MemberListPage() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    setFilter,
    state,
  } = useTable<IMemberPaginatedDto>({
    defaultFilters: {
      userStatus: [UserStatus.ACTIVE],
    },
    defaultSort: [{ field: 'id', order: 'ascend' }],
  });

  const [initialMemberIds] = useState(getFilterValue('id') ?? []);

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: initialMemberIds });

  const { data: members, isLoading } = useQuery({
    ...queryKeys.members.paginated(query),
    enabled: permissions.members.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IMemberPaginatedDto>>('/members/paginated', {
        query,
      }),
  });

  if (!permissions.members.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          <Button
            disabled={!permissions.members.create}
            icon={<UserAddOutlined />}
            onClick={() => navigate(appRoutes.members.new)}
            type="primary"
          >
            Nuevo socio
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  icon: <FileExcelOutlined />,
                  key: 'export',
                  label: 'Exportar',
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space.Compact>
      }
      title="Socios"
    >
      <PageTableActions>
        <TableMembersSearch
          isLoading={isSelectedMembersLoading}
          onFilterChange={(value) => setFilter('id', value ?? [])}
          selectedMembers={selectedMembers}
          value={getFilterValue('id') ?? undefined}
        />

        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IMemberPaginatedDto>
        columns={[
          {
            dataIndex: 'id',
            fixed: 'left',
            render: (id, record) => (
              <Typography.Text className="line-clamp-1 w-full">
                <Link to={appRoutes.members.view(id)}>{record.name}</Link>
              </Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('id'),
            title: 'Socio',
            width: 200,
          },
          {
            align: 'center',
            dataIndex: 'category',
            filteredValue: getFilterValue('category'),
            filterMode: 'tree',
            filters: Object.entries(MemberCategoryLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            render: (value: MemberCategory) => MemberCategoryLabel[value],
            title: 'Categoría',
            width: 150,
          },
          {
            align: 'center',
            dataIndex: 'userStatus',
            filteredValue: getFilterValue('userStatus'),
            filters: Object.entries(UserStatusLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            onFilter: (value, record) => record.userStatus === value,
            render: (value: UserStatus) => UserStatusLabel[value],
            title: 'Estado',
            width: 100,
          },
          {
            dataIndex: 'email',
            render: (text) => (
              <Typography.Text copyable={{ text }}>{text}</Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('email'),
            title: 'Email',
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Tooltip title="Ver deudas">
                  <Link
                    to={{
                      pathname: appRoutes.dues.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.id}`,
                      }).toString(),
                    }}
                  >
                    <Button icon={<DuesIcon />} type="text" />
                  </Link>
                </Tooltip>
                <Tooltip title="Ver pagos">
                  <Link
                    to={{
                      pathname: appRoutes.payments.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.id}`,
                      }).toString(),
                    }}
                  >
                    <Button icon={<PaymentsIcon />} type="text" />
                  </Link>
                </Tooltip>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: 100,
          },
        ]}
        dataSource={members?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: members?.total,
        }}
      />
    </Page>
  );
}
