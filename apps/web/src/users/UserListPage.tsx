import type { PaginatedResponse } from '@club-social/shared/types';

import {
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  type UserDto,
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
import { Page, PageContent, PageHeader, PageTitle } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';

import { usePermissions } from './use-permissions';

export function UserListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const permissions = usePermissions();

  const usersQuery = useQuery({
    enabled: permissions.users.list,
    placeholderData: keepPreviousData,
    queryFn: () => $fetch<PaginatedResponse<UserDto>>('/users/paginated'),
    queryKey: ['users'],
  });

  if (usersQuery.error) {
    message.error(usersQuery.error.message);
  }

  if (!permissions.users.list) {
    return <NotFound />;
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Usuarios</PageTitle>
        <Space.Compact>
          <Button
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
      </PageHeader>
      <PageContent>
        <Table<UserDto>
          dataSource={usersQuery.data?.data}
          loading={usersQuery.isFetching}
        >
          <Table.Column<UserDto>
            dataIndex="id"
            render={(id: string, record: UserDto) => (
              <Typography.Text copyable={{ text: id }}>
                <Link to={`${APP_ROUTES.USER_DETAIL.replace(':id', id)}`}>
                  {record.name}
                </Link>
              </Typography.Text>
            )}
            title="Nombre"
          />
          <Table.Column<UserDto>
            dataIndex="email"
            render={(text) => (
              <Typography.Text copyable={{ text }}>{text}</Typography.Text>
            )}
            title="Email"
          />
          <Table.Column<UserDto>
            align="center"
            dataIndex="status"
            render={(value: UserStatus) => UserStatusLabel[value]}
            title="Estado"
          />
        </Table>
      </PageContent>
    </Page>
  );
}
