import {
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  MemberCategory,
  MemberCategoryLabel,
  type MemberDto,
} from '@club-social/shared/members';
import { type PaginatedResponse } from '@club-social/shared/types';
import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { $fetch } from '@/shared/lib/fetch';
import { useQuery } from '@/shared/lib/useQuery';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

import { useMembers } from './useMembers';

export function MemberListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const permissions = usePermissions();

  const { onChange, status } = useTable<MemberDto>({
    defaultSort: [{ field: 'id', order: 'ascend' }],
  });

  const membersQuery = useMembers();

  const membersList = useQuery({
    enabled: permissions.members.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<MemberDto>>('/members/paginated', {
        query: {
          page: status.page,
          pageSize: status.pageSize,
          ...status.querySort,
          ...status.queryFilters,
        },
      }),
    queryKey: ['members', status],
  });

  if (membersList.error) {
    message.error(membersList.error.message);
  }

  if (!permissions.members.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
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
      }
      title="Socios"
    >
      <Table<MemberDto>
        dataSource={membersList.data?.data}
        loading={membersList.isFetching}
        onChange={onChange}
        pagination={{
          current: status.page,
          pageSize: status.pageSize,
          total: membersList.data?.total,
        }}
        sortDirections={['ascend', 'descend', 'ascend']}
      >
        <Table.Column<MemberDto>
          dataIndex="id"
          defaultFilteredValue={[]}
          filteredValue={status.filters?.id}
          filters={membersQuery.data?.map((member) => ({
            text: `${member.lastName} ${member.firstName}`,
            value: member.id,
          }))}
          filterSearch
          fixed="left"
          render={(id, record) => (
            <Typography.Text copyable={{ text: id }}>
              <Link to={`${APP_ROUTES.MEMBER_LIST}/${id}`}>
                {record.lastName} {record.firstName}
              </Link>
            </Typography.Text>
          )}
          sorter
          sortOrder={status.sort.find((s) => s.field === 'id')?.order}
          title="Socio"
        />
        <Table.Column<MemberDto>
          align="center"
          dataIndex="category"
          filteredValue={status.filters?.category}
          filterMode="tree"
          filters={Object.entries(MemberCategoryLabel).map(
            ([value, label]) => ({
              text: label,
              value,
            }),
          )}
          onFilter={(value, record) => record.category === value}
          render={(value: MemberCategory) => MemberCategoryLabel[value]}
          title="Categoría"
        />
        <Table.Column<MemberDto>
          align="center"
          dataIndex="status"
          filterMode="menu"
          filters={Object.entries(UserStatusLabel).map(([value, label]) => ({
            text: label,
            value,
          }))}
          onFilter={(value, record) => record.status === value}
          render={(value: UserStatus) => UserStatusLabel[value]}
          title="Estado"
        />
        <Table.Column<MemberDto>
          dataIndex="email"
          render={(text) => (
            <Typography.Text copyable={{ text }}>{text}</Typography.Text>
          )}
          sorter
          sortOrder={status.sort.find((s) => s.field === 'email')?.order}
          title="Email"
        />
      </Table>
    </Page>
  );
}
