import type {
  GroupMemberDto,
  GroupPaginatedDto,
} from '@club-social/shared/groups';
import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { keepPreviousData } from '@tanstack/react-query';
import { Button, Space, Tag } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  Card,
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

  const { clearFilters, getSortOrder, onChange, query, resetFilters, state } =
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
            sortOrder: getSortOrder('name'),
            title: 'Nombre',
          },
          {
            dataIndex: 'members',
            render: (members: GroupMemberDto[]) => (
              <Space size="small" wrap>
                {members.map((member) => (
                  <Tag key={member.id}>{member.name}</Tag>
                ))}
              </Space>
            ),
            title: 'Miembros',
            width: 500,
          },
          {
            align: 'center',
            dataIndex: 'discountPercentage',
            render: (discountPercentage: number) => `${discountPercentage}%`,
            title: 'Descuento',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
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
