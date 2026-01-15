import type {
  GroupMemberDto,
  GroupPaginatedDto,
} from '@club-social/shared/groups';
import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { keepPreviousData } from '@tanstack/react-query';
import { Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  Card,
  NavigateToMember,
  NotFound,
  PageTableActions,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  useTable,
} from '@/ui';
import { usePermissions } from '@/users/use-permissions';

export function GroupList() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const { clearFilters, onChange, query, resetFilters, state } =
    useTable<GroupPaginatedDto>({
      defaultSort: [{ field: 'name', order: 'ascend' }],
    });

  const { data: groups, isLoading } = useQuery({
    ...queryKeys.groups.paginated(query),
    enabled: permissions.groups.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedDataResultDto<GroupPaginatedDto>>('/groups/paginated', {
        query,
      }),
  });

  if (!permissions.groups.list) {
    return <NotFound />;
  }

  return (
    <Card
      extra={
        <Space.Compact>
          {permissions.groups.create && (
            <Button
              onClick={() => navigate(appRoutes.groups.new)}
              type="primary"
            >
              Nuevo grupo
            </Button>
          )}
        </Space.Compact>
      }
      title="Grupos"
    >
      <PageTableActions>
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<GroupPaginatedDto>
        columns={[
          {
            dataIndex: 'name',
            render: (name: string, record: GroupPaginatedDto) => (
              <Link to={appRoutes.groups.view(record.id)}>{name}</Link>
            ),
            sorter: true,
            title: 'Nombre',
            width: TABLE_COLUMN_WIDTHS.DATE_TIME,
          },
          {
            dataIndex: 'members',
            render: (members: GroupMemberDto[]) => (
              <>
                {members.map((member) => (
                  <Button key={member.id} type="link">
                    <NavigateToMember id={member.id}>
                      {member.name}
                    </NavigateToMember>
                  </Button>
                ))}
              </>
            ),
            title: 'Miembros',
          },
        ]}
        dataSource={groups?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: groups?.total,
        }}
      />
    </Card>
  );
}
