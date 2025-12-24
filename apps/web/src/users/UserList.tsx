import type { PaginatedResponse } from '@club-social/shared/types';

import {
  type IUserDetailDto,
  UserRole,
  UserRoleLabel,
  UserStatus,
  UserStatusLabel,
} from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { useTable } from '@/ui/Table/useTable';

import { usePermissions } from './use-permissions';

export function UserListPage() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    state,
  } = useTable<IUserDetailDto>({
    defaultFilters: {
      role: [UserRole.STAFF],
      status: [UserStatus.ACTIVE],
    },
    defaultSort: [{ field: 'id', order: 'ascend' }],
  });

  const { data: users, isLoading } = useQuery({
    ...queryKeys.users.paginated(query),
    enabled: permissions.users.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IUserDetailDto>>('/users/paginated', {
        query,
      }),
  });

  if (!permissions.users.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          <Button
            disabled={!permissions.users.create}
            onClick={() => navigate(appRoutes.users.new)}
            type="primary"
          >
            Nuevo usuario
          </Button>
        </Space.Compact>
      }
      title="Usuarios"
    >
      <PageTableActions justify="end">
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IUserDetailDto>
        columns={[
          {
            dataIndex: 'id',
            fixed: 'left',
            render: (id: string, record: IUserDetailDto) => (
              <Typography.Text className="line-clamp-1 w-full">
                <Link to={appRoutes.users.view(id)}>{record.name}</Link>
              </Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('id'),
            title: 'Nombre',
          },
          {
            dataIndex: 'email',
            render: (text) => (
              <Typography.Text copyable={{ text }}>{text}</Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('email'),
            title: 'Email',
            width: 300,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: Object.entries(UserStatusLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (value: UserStatus) => UserStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: 'role',
            filteredValue: getFilterValue('role'),
            filters: [
              {
                text: UserRoleLabel[UserRole.STAFF],
                value: UserRole.STAFF,
              },
            ],
            render: (value: UserRole) => UserRoleLabel[value],
            title: 'Rol',
            width: 100,
          },
        ]}
        dataSource={users?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: users?.total,
        }}
      />
    </Page>
  );
}
