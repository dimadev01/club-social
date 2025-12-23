import type { PaginatedResponse } from '@club-social/shared/types';

import { FileExcelOutlined, MoreOutlined } from '@ant-design/icons';
import {
  type IMovementPaginatedDto,
  type IMovementPaginatedSummaryDto,
  MovementCategory,
  MovementCategoryLabel,
  MovementStatus,
  MovementStatusLabel,
  MovementType,
} from '@club-social/shared/movements';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { queryKeys } from '@/shared/lib/query-keys';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import {
  TABLE_COLUMN_WIDTHS,
  TABLE_DESCRIPTION_MAX_LENGTH,
} from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function MovementList() {
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
    state,
  } = useTable<IMovementPaginatedDto>({
    defaultFilters: {
      status: [MovementStatus.REGISTERED],
    },
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const { data: movements, isLoading } = useQuery({
    ...queryKeys.movements.paginated(query),
    enabled: permissions.movements.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<
        PaginatedResponse<IMovementPaginatedDto, IMovementPaginatedSummaryDto>
      >('/movements', { query }),
  });

  const { exportData, isExporting } = useExport({
    endpoint: '/movements/export',
    filename: `movimientos-${DateFormat.isoDate(new Date())}.csv`,
  });

  if (!permissions.movements.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          {permissions.movements.create && (
            <Button
              icon={<AddNewIcon />}
              onClick={() => navigate(appRoutes.movements.new)}
              type="primary"
            >
              Nuevo movimiento
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
      title="Movimientos"
    >
      <PageTableActions justify="end">
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IMovementPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            render: (createdAt: string, record) => (
              <Link to={appRoutes.movements.view(record.id)}>
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
          },
          {
            align: 'center',
            dataIndex: 'category',
            filteredValue: getFilterValue('category'),
            filterMode: 'tree',
            filters: Object.entries(MovementCategoryLabel).map(
              ([value, label]) => ({
                text: label,
                value,
              }),
            ),
            render: (value: MovementCategory) => MovementCategoryLabel[value],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: Object.entries(MovementStatusLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            render: (value: MovementStatus) => MovementStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            dataIndex: 'description',
            render: (notes: null | string, record) => {
              if (!notes) {
                return '-';
              }

              if (notes.length <= TABLE_DESCRIPTION_MAX_LENGTH) {
                return (
                  <Link to={appRoutes.payments.view(record.paymentId ?? '')}>
                    {notes}
                  </Link>
                );
              }

              return (
                <Tooltip title={notes}>
                  <Link to={appRoutes.payments.view(record.paymentId ?? '')}>
                    {notes.substring(0, TABLE_DESCRIPTION_MAX_LENGTH)}...
                  </Link>
                </Tooltip>
              );
            },
            title: 'Descripción',
            width: 300,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number, record: IMovementPaginatedDto) =>
              record.type === MovementType.OUTFLOW
                ? NumberFormat.formatCents(amount)
                : '',
            title: 'Egreso',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number, record: IMovementPaginatedDto) =>
              record.type === MovementType.INFLOW
                ? NumberFormat.formatCents(amount)
                : '',
            title: 'Ingreso',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
        ]}
        dataSource={movements?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: movements?.total,
        }}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell
                align="right"
                colSpan={5}
                index={0}
                rowSpan={2}
              >
                Totales
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={1}>
                {NumberFormat.formatCents(
                  movements?.summary?.totalAmountOutflow ?? 0,
                )}
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={2}>
                {NumberFormat.formatCents(
                  movements?.summary?.totalAmountInflow ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell align="center" colSpan={2} index={1}>
                {NumberFormat.formatCents(movements?.summary?.totalAmount ?? 0)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </Page>
  );
}
