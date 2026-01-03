import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { MoreOutlined } from '@ant-design/icons';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import {
  MovementCategory,
  MovementCategoryLabel,
  MovementMode,
  MovementModeLabel,
  type MovementPaginatedDto,
  type MovementPaginatedExtraDto,
  MovementStatus,
  MovementStatusLabel,
} from '@club-social/shared/movements';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useExport } from '@/shared/hooks/useExport';
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
  TABLE_DESCRIPTION_MAX_LENGTH,
  TableActions,
  TableDateRangeFilterDropdown,
  useTable,
} from '@/ui';
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
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
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
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            render: (createdAt: string, record) => (
              <Link to={appRoutes.movements.view(record.id)}>
                {DateFormat.dateTime(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
            width: TABLE_COLUMN_WIDTHS.DATE_TIME,
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
            filters: labelMapToFilterOptions(MovementCategoryLabel),
            render: (value: MovementCategory) => MovementCategoryLabel[value],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'center',
            dataIndex: 'mode',
            filteredValue: getFilterValue('mode'),
            filters: labelMapToFilterOptions(MovementModeLabel),
            render: (value: MovementMode) => MovementModeLabel[value],
            title: 'Modo',
            width: 100,
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
            width: 250,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount < 0 ? NumberFormat.formatCurrencyCents(amount) : '',
            title: 'Egreso',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount > 0 ? NumberFormat.formatCurrencyCents(amount) : '',
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
                colSpan={6}
                index={0}
                rowSpan={2}
              >
                Totales
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={1}>
                {NumberFormat.formatCurrencyCents(
                  movements?.extra?.totalAmountOutflow ?? 0,
                )}
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={2}>
                {NumberFormat.formatCurrencyCents(
                  movements?.extra?.totalAmountInflow ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell align="center" colSpan={2} index={1}>
                {NumberFormat.formatCurrencyCents(
                  movements?.extra?.totalAmount ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
