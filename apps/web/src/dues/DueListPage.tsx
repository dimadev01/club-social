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
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function DueListPage() {
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

  const memberSelectQuery = useMembersForSelect({
    memberIds: getFilterValue('memberId') ?? [],
  });

  const duesQuery = useQuery({
    enabled: permissions.dues.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IDuePaginatedDto>>('/dues/paginated', { query }),
    queryKey: ['dues', state, query],
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
              onClick={() => navigate(APP_ROUTES.DUE_NEW)}
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
          isFetching={memberSelectQuery.isFetching}
          onFilterChange={(value) => setFilter('memberId', value)}
          selectedMembers={memberSelectQuery.data}
          value={
            memberSelectQuery.data?.map((member) => member.id) ?? undefined
          }
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
              <Link to={`${APP_ROUTES.DUE_LIST}/${record.id}`}>
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
              <Link to={`${APP_ROUTES.MEMBER_LIST}/${memberId}`}>
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
                  <Button
                    disabled={getFilterValue('memberId')?.includes(
                      record.memberId,
                    )}
                    icon={<FilterOutlined />}
                    onClick={() => {
                      setFilter('memberId', [record.memberId]);
                    }}
                    type="text"
                  />
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
