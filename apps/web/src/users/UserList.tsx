import type { PaginatedDataResultDto } from '@club-social/shared/types';

import {
  type UserDto,
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
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import {
  Card,
  NotFound,
  PageTableActions,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  useTable,
} from '@/ui';

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
  } = useTable<UserDto>({
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
      $fetch<PaginatedDataResultDto<UserDto>>('/users/paginated', {
        query,
      }),
  });

  if (!permissions.users.list) {
    return <NotFound />;
  }

  return (
    <Card
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

      <Table<UserDto>
        columns={[
          {
            dataIndex: 'id',
            fixed: 'left',
            render: (id: string, record: UserDto) => (
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
            filters: labelMapToFilterOptions(UserStatusLabel),
            render: (value: UserStatus) => UserStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.DUE_STATUS,
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
    </Card>
  );
}
