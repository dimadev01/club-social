import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { MoreOutlined } from '@ant-design/icons';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategory,
  MovementCategoryLabel,
  type MovementPaginatedDto,
  type MovementPaginatedExtraDto,
  MovementStatus,
  MovementStatusLabel,
} from '@club-social/shared/movements';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip } from 'antd';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import {
  Card,
  NavigateToMovement,
  NotFound,
  PageTableActions,
  Table,
  TABLE_COLUMN_WIDTHS,
  TABLE_DESCRIPTION_MAX_LENGTH,
  TableActions,
  TableDateRangeFilterDropdown,
  useTable,
} from '@/ui';
import { TableSummaryTotalFilterText } from '@/ui/Table/TableSummaryTotalFilterText';
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
  } = useTable<MovementPaginatedDto>({
    defaultSort: [{ field: 'date', order: 'descend' }],
  });

  const { data: movements, isLoading } = useQuery({
    ...queryKeys.movements.paginated(query),
    enabled: permissions.movements.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<
        PaginatedDataResultDto<MovementPaginatedDto, MovementPaginatedExtraDto>
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
    <Card
      extra={
        <Space.Compact>
          {permissions.movements.create && (
            <Button
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

      <Table<MovementPaginatedDto>
        columns={[
          {
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),
            filteredValue: getFilterValue('date'),
            render: (date: string, record: MovementPaginatedDto) => (
              <NavigateToMovement id={record.id}>{date}</NavigateToMovement>
            ),
            sorter: true,
            sortOrder: getSortOrder('date'),
            title: 'Fecha',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            align: 'center',
            dataIndex: 'category',
            filteredValue: getFilterValue('category'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(MovementCategoryLabel),
            render: (value: MovementCategory) => MovementCategoryLabel[value],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.MOVEMENT_CATEGORY,
          },
          {
            dataIndex: 'notes',
            render: (notes: null | string) => {
              if (!notes) {
                return '-';
              }

              if (notes.length <= TABLE_DESCRIPTION_MAX_LENGTH) {
                return notes;
              }

              return (
                <Tooltip title={notes}>
                  {notes.substring(0, TABLE_DESCRIPTION_MAX_LENGTH)}...
                </Tooltip>
              );
            },
            title: 'Notas',
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: labelMapToFilterOptions(MovementStatusLabel),
            render: (value: MovementStatus) => MovementStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount < 0
                ? NumberFormat.currencyCents(Math.abs(amount), {
                    maximumFractionDigits: 2,
                  })
                : '',
            title: 'Egreso',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount > 0
                ? NumberFormat.currencyCents(amount, {
                    maximumFractionDigits: 2,
                  })
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
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell
                align="right"
                colSpan={4}
                index={0}
                rowSpan={2}
              >
                <TableSummaryTotalFilterText title="Totales" />
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={1}>
                {NumberFormat.currencyCents(
                  movements?.extra?.totalAmountOutflow ?? 0,
                )}
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={2}>
                {NumberFormat.currencyCents(
                  movements?.extra?.totalAmountInflow ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>

            <Table.Summary.Row>
              <Table.Summary.Cell align="center" colSpan={2} index={0}>
                {NumberFormat.currencyCents(movements?.extra?.totalAmount ?? 0)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
