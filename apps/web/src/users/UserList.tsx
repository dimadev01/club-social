import type { PaginatedDataResultDto } from '@club-social/shared/types';

import {
  type UserDto,
  UserRole,
  UserStatus,
  UserStatusLabel,
} from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Flex, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToSelectOptions } from '@/shared/lib/utils';
import {
  Card,
  NotFound,
  PageTableActions,
  Select,
  Table,
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
    setFilter,
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
        <Flex gap="middle" wrap>
          <Select
            className="min-w-full md:min-w-40"
            mode="multiple"
            onChange={(value) => setFilter('status', value)}
            options={labelMapToSelectOptions(UserStatusLabel)}
            placeholder="Filtrar por rol"
            value={getFilterValue('status') ?? undefined}
          />
        </Flex>
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
            width: 400,
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
