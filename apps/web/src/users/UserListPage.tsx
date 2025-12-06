import type { PaginatedResponse } from '@club-social/types/shared';
import type { UserDto } from '@club-social/types/users';

import { EditOutlined, MoreOutlined, UserAddOutlined } from '@ant-design/icons';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Button, Dropdown, Flex, Space, Table, Typography } from 'antd';
import { Link } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { Page, PageContent } from '@/components/Page';
import { $fetch } from '@/shared/lib/api';

export function UserListPage() {
  const usersQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => $fetch<PaginatedResponse<UserDto>>('/users/paginated'),
    queryKey: ['users'],
  });

  return (
    <Page>
      <PageContent>
        <Table
          columns={[
            {
              dataIndex: 'id',
              render: (value) => (
                <Link to={`${APP_ROUTES.USER_DETAIL.replace(':id', value)}`}>
                  {value}
                </Link>
              ),
              title: 'Nombre',
            },
          ]}
          dataSource={usersQuery.data?.data}
          rowKey="id"
          showHeader
          title={() => (
            <Flex align="center" gap="small" justify="space-between" wrap>
              <Typography.Text strong>Usuarios</Typography.Text>
              <Space.Compact>
                <Button icon={<UserAddOutlined />} type="primary">
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
            </Flex>
          )}
        />

        <Button type="primary">Nuevo usuario</Button>
      </PageContent>
    </Page>
  );
}
