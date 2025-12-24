import type { PaginatedResponse } from '@club-social/shared/types';

import { FilterOutlined, MoreOutlined } from '@ant-design/icons';
import { DueCategoryOptions } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import {
  type IPaymentPaginatedDto,
  type IPaymentPaginatedExtraDto,
  PaymentStatus,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, type TableColumnType, Tooltip } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { DuesIcon } from '@/ui/Icons/DuesIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Select } from '@/ui/Select';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function PaymentList() {
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
  } = useTable<IPaymentPaginatedDto>({
    defaultFilters: {
      status: [PaymentStatus.PAID],
    },
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const [filteredMemberIds, setFilteredMemberIds] = useState(
    getFilterValue('memberId') ?? [],
  );

  const { exportData, isExporting } = useExport({
    endpoint: '/payments/export',
    filename: `pagos-${DateFormat.isoDate(new Date())}.csv`,
  });

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const { data: payments, isLoading } = useQuery({
    ...queryKeys.payments.paginated(query),
    enabled: permissions.payments.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<
        PaginatedResponse<IPaymentPaginatedDto, IPaymentPaginatedExtraDto>
      >('payments/paginated', { query }),
  });

  if (!permissions.payments.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          {permissions.payments.create && (
            <Button
              disabled={!permissions.payments.create}
              onClick={() => navigate(appRoutes.payments.new)}
              type="primary"
            >
              Nuevo pago
            </Button>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  disabled: isExporting,
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
      title="Pagos"
    >
      <PageTableActions>
        <TableMembersSearch
          isLoading={isSelectedMembersLoading}
          onFilterChange={(value) => setFilter('memberId', value)}
          selectedMembers={selectedMembers}
          value={getFilterValue('memberId') ?? undefined}
        />
        <Select
          className="min-w-full md:min-w-xs"
          mode="multiple"
          onChange={(value) => setFilter('dueCategory', value)}
          options={DueCategoryOptions}
          placeholder="Filtrar por categoría de deuda"
          value={getFilterValue('dueCategory') ?? undefined}
        />
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IPaymentPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            fixed: 'left',
            render: (createdAt: string, record) => (
              <Link to={appRoutes.payments.view(record.id)}>
                {DateFormat.dateTime(createdAt)}
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
          },
          ...(permissions.payments.listAll
            ? [
                {
                  dataIndex: 'memberId',
                  render: (memberId: string, record: IPaymentPaginatedDto) => (
                    <Link to={appRoutes.members.view(memberId)}>
                      {record.memberName}
                    </Link>
                  ),
                  title: 'Socio',
                } satisfies TableColumnType<IPaymentPaginatedDto>,
              ]
            : []),
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
            filters: Object.entries(PaymentStatusLabel).map(
              ([value, label]) => ({
                text: label,
                value,
              }),
            ),
            render: (value: PaymentStatus) => PaymentStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          ...(permissions.payments.listAll
            ? [
                {
                  align: 'center',
                  fixed: 'right',
                  render: (_, record) => (
                    <Space.Compact size="small">
                      <Tooltip title="Filtrar por este socio">
                        <Link
                          to={{
                            pathname: appRoutes.payments.list,
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
                            onClick={() =>
                              setFilteredMemberIds([record.memberId])
                            }
                            type="text"
                          />
                        </Link>
                      </Tooltip>
                      <Tooltip title="Ver deudas">
                        <Link
                          to={{
                            pathname: appRoutes.dues.list,
                            search: new URLSearchParams({
                              filters: `memberId:${record.memberId}`,
                            }).toString(),
                          }}
                        >
                          <Button icon={<DuesIcon />} type="text" />
                        </Link>
                      </Tooltip>
                    </Space.Compact>
                  ),
                  title: 'Acciones',
                  width: TABLE_COLUMN_WIDTHS.ACTIONS,
                } satisfies TableColumnType<IPaymentPaginatedDto>,
              ]
            : []),
        ]}
        dataSource={payments?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: payments?.total,
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell align="right" colSpan={1} index={0}>
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell colSpan={5} index={1}>
              {NumberFormat.formatCents(payments?.extra?.totalAmount ?? 0)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Page>
  );
}
