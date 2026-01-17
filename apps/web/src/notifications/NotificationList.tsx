import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { DateFormat } from '@club-social/shared/lib';
import {
  NotificationChannel,
  NotificationChannelLabel,
  type NotificationPaginatedDto,
  NotificationStatus,
  NotificationStatusLabel,
  NotificationType,
  NotificationTypeLabel,
} from '@club-social/shared/notifications';
import { keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
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

export function NotificationList() {
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    state,
  } = useTable<NotificationPaginatedDto>({
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const { data: notifications, isLoading } = useQuery({
    ...queryKeys.notifications.paginated(query),
    enabled: permissions.notifications.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedDataResultDto<NotificationPaginatedDto>>(
        '/notifications',
        { query },
      ),
  });

  if (!permissions.notifications.list) {
    return <NotFound />;
  }

  return (
    <Card title="Notificaciones">
      <PageTableActions justify="end">
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<NotificationPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            render: (createdAt: string, record: NotificationPaginatedDto) => (
              <Link to={appRoutes.notifications.view(record.id)}>
                {DateFormat.dateTime(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Fecha',
          },
          {
            align: 'center',
            dataIndex: 'type',
            filteredValue: getFilterValue('type'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(NotificationTypeLabel),
            render: (value: NotificationType) => NotificationTypeLabel[value],
            title: 'Tipo',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: 'channel',
            filteredValue: getFilterValue('channel'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(NotificationChannelLabel),
            render: (value: NotificationChannel) =>
              NotificationChannelLabel[value],
            title: 'Canal',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            dataIndex: 'recipientAddress',
            title: 'Destinatario',
          },
          {
            dataIndex: 'memberName',
            title: 'Socio',
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(NotificationStatusLabel),
            render: (value: NotificationStatus) =>
              NotificationStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
        ]}
        dataSource={notifications?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: notifications?.total,
        }}
      />
    </Card>
  );
}
