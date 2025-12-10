import type { PaginatedResponse } from '@club-social/shared/shared';
import type { UserDto } from '@club-social/shared/users';

import {
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Action, Resource } from '@club-social/shared/roles';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Table, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { Page, PageContent, PageHeader, PageTitle } from '@/components/Page';
import { $fetch } from '@/shared/lib/fetch';
import { useQuery } from '@/shared/lib/useQuery';

import { useHasPermission } from './use-has-permission';

export function UserListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const hasUsersListPermission = useHasPermission(Resource.USERS, Action.LIST);

  const usersQuery = useQuery({
    enabled: hasUsersListPermission,
    placeholderData: keepPreviousData,
    queryFn: () => $fetch<PaginatedResponse<UserDto>>('/users/paginated'),
    queryKey: ['users'],
  });

  if (usersQuery.error) {
    message.error(usersQuery.error.message);
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
        <Table
          columns={[
            {
              dataIndex: 'id',
              render: (value, record) => (
                <Typography.Text copyable={{ text: record.name }}>
                  <Link to={`${APP_ROUTES.USER_DETAIL.replace(':id', value)}`}>
                    {record.name}
                  </Link>
                </Typography.Text>
              ),
              title: 'Nombre',
            },
            {
              dataIndex: 'email',
              render: (value) => (
                <Typography.Text copyable>{value}</Typography.Text>
              ),
              title: 'Email',
            },
          ]}
          dataSource={usersQuery.data?.data}
          loading={usersQuery.isFetching}
          rowKey="id"
          showHeader
        />
      </PageContent>
    </Page>
  );
}
