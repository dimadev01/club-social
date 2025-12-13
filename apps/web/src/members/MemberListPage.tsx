import type { PaginatedResponse } from '@club-social/shared/shared';

import {
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { MemberCategory, type MemberDto } from '@club-social/shared/members';
import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Table, Tag, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { NotFound } from '@/components/NotFound';
import { Page, PageContent, PageHeader, PageTitle } from '@/components/Page';
import { $fetch } from '@/shared/lib/fetch';
import { useQuery } from '@/shared/lib/useQuery';
import { usePermissions } from '@/users/use-permissions';

export function MemberListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const permissions = usePermissions();

  const membersQuery = useQuery({
    enabled: permissions.members.list,
    placeholderData: keepPreviousData,
    queryFn: () => $fetch<PaginatedResponse<MemberDto>>('/members/paginated'),
    queryKey: ['members'],
  });

  if (membersQuery.error) {
    message.error(membersQuery.error.message);
  }

  if (!permissions.members.list) {
    return <NotFound />;
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Socios</PageTitle>
        <Space.Compact>
          <Button
            disabled={!permissions.members.create}
            icon={<UserAddOutlined />}
            onClick={() => navigate(APP_ROUTES.MEMBER_NEW)}
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
      </PageHeader>
      <PageContent>
        <Table<MemberDto>
          dataSource={membersQuery.data?.data}
          loading={membersQuery.isFetching}
          rowKey="id"
          scroll={{ x: 'max-content', y: 800 }}
        >
          <Table.Column<MemberDto>
            dataIndex="firstName"
            render={(_, record) => (
              <Typography.Text copyable={{ text: record.id }}>
                <Link to={`${APP_ROUTES.MEMBER_LIST}/${record.id}`}>
                  {record.firstName} {record.lastName}
                </Link>
              </Typography.Text>
            )}
            title="Nombre"
          />
          <Table.Column<MemberDto>
            dataIndex="email"
            render={(text) => (
              <Typography.Text copyable={{ text }}>{text}</Typography.Text>
            )}
            title="Email"
          />
          <Table.Column<MemberDto> dataIndex="documentID" title="Documento" />
          <Table.Column<MemberDto>
            dataIndex="category"
            render={(value: MemberCategory) => <Tag>{value}</Tag>}
            title="Categoría"
          />
          <Table.Column<MemberDto>
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
