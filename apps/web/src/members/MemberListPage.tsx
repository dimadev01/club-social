import {
  EyeOutlined,
  FileExcelOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  MemberCategory,
  MemberCategoryLabel,
  type MemberListDto,
} from '@club-social/shared/members';
import { type PaginatedResponse } from '@club-social/shared/types';
import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

import { MemberSearchSelect } from './MemberSearchSelect';
import { useMembersForSelect } from './useMembersForSelect';

export function MemberListPage() {
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
    setFilter,
    state,
  } = useTable<MemberListDto>({
    defaultFilters: {
      status: [UserStatus.ACTIVE],
    },
    defaultSort: [{ field: 'id', order: 'ascend' }],
  });

  const [initialMemberIds] = useState(getFilterValue('id') ?? []);

  const { data: selectedMembers, isFetching } = useMembersForSelect({
    memberIds: initialMemberIds,
  });

  const membersList = useQuery({
    enabled: permissions.members.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<MemberListDto>>('/members/paginated', { query }),
    queryKey: ['members', query],
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
      <Flex className="mb-4" gap="middle" justify="space-between">
        <MemberSearchSelect
          additionalOptions={selectedMembers}
          allowClear
          className="min-w-xs"
          disabled={isFetching}
          loading={isFetching}
          mode="multiple"
          onChange={(value) =>
            setFilter('id', value?.length ? (value as string[]) : undefined)
          }
          placeholder="Filtrar por socio..."
          value={getFilterValue('id') ?? undefined}
        />

        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </Flex>

      <Table<MemberListDto>
        dataSource={membersList.data?.data}
        loading={membersList.isFetching}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: membersList.data?.total,
        }}
      >
        <Table.Column<MemberListDto>
          dataIndex="id"
          fixed="left"
          render={(id, record) => (
            <Typography.Text className="line-clamp-1 w-full">
              <Link to={`${APP_ROUTES.MEMBER_LIST}/${id}`}>{record.name}</Link>
            </Typography.Text>
          )}
          sorter
          sortOrder={getSortOrder('id')}
          title="Socio"
          width={200}
        />
        <Table.Column<MemberListDto>
          align="center"
          dataIndex="category"
          filteredValue={getFilterValue('category')}
          filterMode="tree"
          filters={Object.entries(MemberCategoryLabel).map(
            ([value, label]) => ({ text: label, value }),
          )}
          onFilter={(value, record) => record.category === value}
          render={(value: MemberCategory) => MemberCategoryLabel[value]}
          title="Categoría"
          width={150}
        />
        <Table.Column<MemberListDto>
          align="center"
          dataIndex="status"
          filteredValue={getFilterValue('status')}
          filters={Object.entries(UserStatusLabel).map(([value, label]) => ({
            text: label,
            value,
          }))}
          onFilter={(value, record) => record.status === value}
          render={(value: UserStatus) => UserStatusLabel[value]}
          title="Estado"
          width={100}
        />
        <Table.Column<MemberListDto>
          dataIndex="email"
          render={(text) => (
            <Typography.Text copyable={{ text }}>{text}</Typography.Text>
          )}
          sorter
          sortOrder={getSortOrder('email')}
          title="Email"
        />
        <Table.Column<MemberListDto>
          align="center"
          fixed="right"
          render={(_, record) => (
            <Space.Compact size="small">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(APP_ROUTES.MEMBER_DETAIL.replace(':id', record.id))
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
