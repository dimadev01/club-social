import type { PaginatedResponse } from '@club-social/shared/types';

import {
  FileExcelOutlined,
  FilterOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  type DueCategory,
  DueCategoryLabel,
  DueStatus,
  DueStatusLabel,
  type IDuePaginatedDto,
} from '@club-social/shared/dues';
import { type UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES, appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { queryKeys } from '@/shared/lib/query-keys';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { PaymentsIcon } from '@/ui/Icons/PaymentsIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function DueList() {
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
  } = useTable<IDuePaginatedDto>({
    defaultFilters: {
      status: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID, DueStatus.PAID],
    },
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const [filteredMemberIds, setFilteredMemberIds] = useState(
    getFilterValue('memberId') ?? [],
  );

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const duesQuery = useQuery({
    ...queryKeys.dues.paginated(query),
    enabled: permissions.dues.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IDuePaginatedDto>>('/dues/paginated', { query }),
  });

  if (duesQuery.error) {
    message.error(duesQuery.error.message);
  }

  if (!permissions.dues.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          {permissions.dues.create && (
            <Button
              disabled={!permissions.dues.create}
              icon={<AddNewIcon />}
              onClick={() => navigate(APP_ROUTES.DUES_NEW)}
              type="primary"
            >
              Nueva deuda
            </Button>
          )}
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
      title="Deudas"
    >
      <PageTableActions>
        <TableMembersSearch
          isLoading={isSelectedMembersLoading}
          onFilterChange={(value) => setFilter('memberId', value)}
          selectedMembers={selectedMembers}
          value={getFilterValue('memberId') ?? undefined}
        />
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IDuePaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            render: (createdAt: string, record) => (
              <Link to={`${APP_ROUTES.DUES_LIST}/${record.id}`}>
                {DateFormat.date(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
            width: 150,
          },
          {
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),
            filteredValue: getFilterValue('date'),
            render: (date: string) => DateFormat.date(date),
            title: 'Fecha',
            width: 150,
          },
          {
            dataIndex: 'memberId',
            render: (memberId: string, record: IDuePaginatedDto) => (
              <Link to={`${APP_ROUTES.MEMBERS_LIST}/${memberId}`}>
                {record.memberName}
              </Link>
            ),
            title: 'Socio',
            width: 200,
          },
          {
            align: 'center',
            dataIndex: 'category',
            filteredValue: getFilterValue('category'),
            filters: Object.entries(DueCategoryLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (value: DueCategory) => DueCategoryLabel[value],
            title: 'Categoría',
            width: 150,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.formatCents(amount),
            title: 'Monto',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filterMode: 'tree',
            filters: Object.entries(DueStatusLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (value: DueStatus) => DueStatusLabel[value],
            title: 'Estado',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'userStatus',
            filteredValue: getFilterValue('userStatus'),
            filters: Object.entries(UserStatusLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (value: UserStatus) => UserStatusLabel[value],
            title: 'Estado Socio',
            width: 150,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Tooltip title="Filtrar por este socio">
                  <Link
                    to={`${appRoutes.dues.list}?filters=memberId:${record.memberId}`}
                  >
                    <Button
                      disabled={getFilterValue('memberId')?.includes(
                        record.memberId,
                      )}
                      icon={<FilterOutlined />}
                      onClick={() => setFilteredMemberIds([record.memberId])}
                      type="text"
                    />
                  </Link>
                </Tooltip>

                <Tooltip title="Nuevo pago">
                  <Link
                    to={`${APP_ROUTES.PAYMENTS_NEW}?memberId=${record.memberId}`}
                  >
                    <Button
                      icon={<PaymentsIcon />}
                      onClick={() => setFilteredMemberIds([record.memberId])}
                      type="text"
                    />
                  </Link>
                </Tooltip>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: 100,
          },
        ]}
        dataSource={duesQuery.data?.data}
        loading={duesQuery.isFetching}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: duesQuery.data?.total,
        }}
      />
    </Page>
  );
}
