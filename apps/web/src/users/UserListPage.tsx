import type { PaginatedResponse } from '@club-social/types/shared';
import type { UserDto } from '@club-social/types/users';

import { EditOutlined, MoreOutlined, UserAddOutlined } from '@ant-design/icons';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Button, Dropdown, Space, Table, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { Page, PageContent, PageHeader } from '@/components/Page';
import { $fetch } from '@/shared/lib/api';

export function UserListPage() {
  const usersQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => $fetch<PaginatedResponse<UserDto>>('/users/paginated'),
    queryKey: ['users'],
  });

  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader>
        <Typography.Text strong>Usuarios</Typography.Text>
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
                  icon: <EditOutlined />,
                  key: 'edit',
                  label: 'Editar',
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
