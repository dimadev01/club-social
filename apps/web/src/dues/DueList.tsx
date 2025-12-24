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
  type IDuePaginatedExtraDto,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { type UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { PaymentsIcon } from '@/ui/Icons/PaymentsIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function DueList() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const {
    clearFilters,
    exportQuery,
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

  const { exportData, isExporting } = useExport({
    endpoint: '/dues/export',
    filename: `deudas-${DateFormat.isoDate(new Date())}.csv`,
  });

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const { data: dues, isLoading } = useQuery({
    ...queryKeys.dues.paginated(query),
    enabled: permissions.dues.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IDuePaginatedDto, IDuePaginatedExtraDto>>(
        '/dues/paginated',
        { query },
      ),
  });

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
              onClick={() => navigate(appRoutes.dues.new)}
              type="primary"
            >
              Nueva deuda
            </Button>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  disabled: isExporting,
                  icon: <FileExcelOutlined />,
                  key: 'export',
                  label: 'Exportar',
                  onClick: () => exportData(exportQuery),
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
            fixed: 'left',
            render: (createdAt: string, record) => (
              <Link to={appRoutes.dues.view(record.id)}>
                {DateFormat.date(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),
            filteredValue: getFilterValue('date'),
            render: (date: string) => DateFormat.date(date),
            title: 'Fecha',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            dataIndex: 'memberId',
            render: (memberId: string, record: IDuePaginatedDto) => (
              <Link to={appRoutes.members.view(memberId)}>
                {record.memberName}
              </Link>
            ),
            title: 'Socio',
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
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.formatCents(amount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
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
            width: TABLE_COLUMN_WIDTHS.STATUS,
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
            width: TABLE_COLUMN_WIDTHS.STATUS + 50,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Tooltip title="Filtrar por este socio">
                  <Link
                    to={{
                      pathname: appRoutes.dues.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.memberId}`,
                      }).toString(),
                    }}
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
                    to={`${appRoutes.payments.new}?memberId=${record.memberId}`}
                  >
                    <Button
                      disabled={record.status === DueStatus.PAID}
                      icon={<PaymentsIcon />}
                      onClick={() => setFilteredMemberIds([record.memberId])}
                      type="text"
                    />
                  </Link>
                </Tooltip>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: TABLE_COLUMN_WIDTHS.ACTIONS,
          },
        ]}
        dataSource={dues?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: dues?.total,
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell align="right" colSpan={1} index={0}>
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell colSpan={7} index={1}>
              {NumberFormat.formatCents(dues?.extra?.totalAmount ?? 0)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Page>
  );
}
