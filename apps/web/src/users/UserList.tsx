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
  NotFound,
  Page,
  PageActions,
  PageHeader,
  PageTableActions,
  PageTitle,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  Tag,
  useTable,
} from '@/ui';

import { usePermissions } from './use-permissions';
import { UserStatusColor } from './UserUtil';

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
    <Page>
      <PageHeader>
        <PageTitle>Usuarios</PageTitle>
        <PageActions>
          <Space.Compact>
            <Button
              disabled={!permissions.users.create}
              onClick={() => navigate(appRoutes.users.new)}
              type="primary"
            >
              Nuevo usuario
            </Button>
          </Space.Compact>
        </PageActions>
      </PageHeader>
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
            width: TABLE_COLUMN_WIDTHS.XXXL,
          },
          {
            align: 'center',
            dataIndex: 'role',
            render: (value: UserRole) => UserRoleLabel[value],
            title: 'Rol',
            width: TABLE_COLUMN_WIDTHS.SM,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: labelMapToFilterOptions(UserStatusLabel),
            render: (value: UserStatus) => (
              <Tag color={UserStatusColor[value]}>{UserStatusLabel[value]}</Tag>
            ),
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.MD,
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
