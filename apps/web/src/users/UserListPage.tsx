import type { PaginatedResponse } from '@club-social/shared/types';

import {
  EyeOutlined,
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  type IUserDetailDto,
  UserRole,
  UserRoleLabel,
  UserStatus,
  UserStatusLabel,
} from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { useTable } from '@/ui/Table/useTable';

import { usePermissions } from './use-permissions';

export function UserListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
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

  const usersQuery = useQuery({
    enabled: permissions.users.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IUserDetailDto>>('/users/paginated', {
        query,
      }),
    queryKey: ['users', query],
  });

  if (usersQuery.error) {
    message.error(usersQuery.error.message);
  }

  if (!permissions.users.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          <Button
            disabled={!permissions.users.create}
            icon={<UserAddOutlined />}
            onClick={() => navigate(APP_ROUTES.USER_NEW)}
            type="primary"
          >
            Nuevo usuario
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
      title="Usuarios"
    >
      <PageTableActions justify="end">
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IUserDetailDto>
        dataSource={usersQuery.data?.data}
        loading={usersQuery.isFetching}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: usersQuery.data?.total,
        }}
      >
        <Table.Column<IUserDetailDto>
          dataIndex="id"
          fixed="left"
          render={(id: string, record: IUserDetailDto) => (
            <Typography.Text className="line-clamp-1 w-full">
              <Link to={`${APP_ROUTES.USER_DETAIL.replace(':id', id)}`}>
                {record.name}
              </Link>
            </Typography.Text>
          )}
          sorter
          sortOrder={getSortOrder('id')}
          title="Nombre"
          width={200}
        />
        <Table.Column<IUserDetailDto>
          dataIndex="email"
          render={(text) => (
            <Typography.Text copyable={{ text }}>{text}</Typography.Text>
          )}
          sorter
          sortOrder={getSortOrder('email')}
          title="Email"
        />
        <Table.Column<IUserDetailDto>
          align="center"
          dataIndex="status"
          filteredValue={getFilterValue('status')}
          filters={Object.entries(UserStatusLabel).map(([value, label]) => ({
            text: label,
            value,
          }))}
          render={(value: UserStatus) => UserStatusLabel[value]}
          title="Estado"
          width={100}
        />
        <Table.Column<IUserDetailDto>
          align="center"
          dataIndex="role"
          filteredValue={getFilterValue('role')}
          filters={[
            {
              text: UserRoleLabel[UserRole.STAFF],
              value: UserRole.STAFF,
            },
          ]}
          render={(value: UserRole) => UserRoleLabel[value]}
          title="Rol"
          width={100}
        />
        <Table.Column<IUserDetailDto>
          align="center"
          fixed="right"
          render={(_, record) => (
            <Space.Compact size="small">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(APP_ROUTES.USER_DETAIL.replace(':id', record.id))
                }
                type="text"
              />
            </Space.Compact>
          )}
          title="Acciones"
          width={100}
        />
      </Table>
    </Page>
  );
}
