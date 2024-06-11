import { SwapOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Space, Table, Typography } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  MovementCategoryEnum,
  MovementCategoryLabel,
  MovementStatusEnum,
  MovementStatusLabel,
  MovementTypeEnum,
  MovementTypeLabel,
  getCategoryFilters,
  getMovementStatusColumnFilters,
  getMovementTypeOptions,
} from '@domain/categories/category.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { FindPaginatedMovementsFilters } from '@domain/movements/movement.repository';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { MovementsGridCsvDownloaderButton } from '@ui/components/Movements/MovementsGridCsvDownloader';
import { useMovementsTotals } from '@ui/hooks/movements/useMovementsTotals';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';

export const MovementsPage = () => {
  const { gridState, onTableChange } = useTable<MovementGridDto>({
    defaultFilters: {
      category: [],
      createdAt: [],
      date: [],
      status: [MovementStatusEnum.REGISTERED],
      type: [],
    },
    defaultSorter: { createdAt: 'descend' },
  });

  const gridRequestFilters: FindPaginatedMovementsFilters = {
    filterByCategory: gridState.filters.category as MovementCategoryEnum[],
    filterByCreatedAt: gridState.filters.createdAt,
    filterByDate: gridState.filters.date,
    filterByStatus: gridState.filters.status as MovementStatusEnum[],
    filterByType: gridState.filters.type as MovementTypeEnum[],
  };

  const gridRequest: GetMovementsGridRequestDto = {
    ...gridRequestFilters,
    limit: gridState.pageSize,
    page: gridState.page,
    sorter: gridState.sorter,
  };

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetMovementsGridRequestDto,
    MovementGridDto
  >({
    methodName: MeteorMethodEnum.MovementsGetGrid,
    request: gridRequest,
  });

  const { data: movementsTotals } = useMovementsTotals(gridRequestFilters);

  const renderCreatedAtFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Creación"
      value={gridState.filters.createdAt}
      props={props}
    />
  );

  const renderDateFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Movimiento"
      value={gridState.filters.date}
      props={props}
    />
  );

  const renderSummary = () => (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell align="right" index={0} colSpan={5}>
          <Typography.Text strong>
            Total:{' '}
            {new Money({
              amount: movementsTotals?.amount ?? 0,
            }).formatWithCurrency()}
          </Typography.Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} colSpan={3} />
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Movimientos' }]}
      />

      <Card
        title={
          <Space>
            <SwapOutlined />
            <span>Movimientos</span>
          </Space>
        }
        extra={
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <MovementsGridCsvDownloaderButton request={gridRequest} />
            <GridNewButton
              scope={ScopeEnum.MOVEMENTS}
              to={AppUrl.MovementsNew}
            />
          </Space.Compact>
        }
      >
        <Grid<MovementGridDto>
          summary={renderSummary}
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
          rowClassName={(movement) => {
            if (movement.status === MovementStatusEnum.VOIDED) {
              return 'bg-gray-100 dark:bg-gray-900';
            }

            if (movement.type === MovementTypeEnum.EXPENSE) {
              return 'bg-red-100 dark:bg-red-900';
            }

            if (movement.type === MovementTypeEnum.INCOME) {
              return 'bg-green-100 dark:bg-green-900';
            }

            throw new Error('Unknown movement type');
          }}
          columns={[
            {
              dataIndex: 'createdAt',
              ellipsis: true,
              filterDropdown: renderCreatedAtFilter,
              filteredValue: gridState.filters.createdAt,
              render: (date: string, movement: MovementGridDto) => (
                <Link to={`${AppUrl.Movements}/${movement.id}`}>
                  {new DateVo(date).format(DateFormatEnum.DDMMYYHHmm)}
                </Link>
              ),
              sortOrder: gridState.sorter.createdAt,
              sorter: true,
              title: 'Fecha de creación',
              width: 125,
            },
            {
              dataIndex: 'date',
              ellipsis: true,
              filterDropdown: renderDateFilter,
              filteredValue: gridState.filters.date,
              render: (date: string) => new DateUtcVo(date).format(),
              title: 'Fecha de movimiento',
              width: 100,
            },
            {
              align: 'center',
              dataIndex: 'type',
              ellipsis: true,
              filteredValue: gridState.filters.type,
              filters: getMovementTypeOptions(),
              render: (type: MovementTypeEnum) => MovementTypeLabel[type],
              title: 'Tipo',
              width: 75,
            },
            {
              align: 'center',
              dataIndex: 'category',
              ellipsis: true,
              filteredValue: gridState.filters.category,
              filters: getCategoryFilters(),
              render: (category: MovementCategoryEnum) =>
                MovementCategoryLabel[category],
              title: 'Categoría',
              width: 100,
            },
            {
              align: 'right',
              dataIndex: 'amount',
              ellipsis: true,
              render: (amount) => new Money({ amount }).formatWithCurrency(),
              title: 'Importe',
              width: 75,
            },
            {
              align: 'center',
              dataIndex: 'paymentId',
              ellipsis: true,
              render: (paymentId: string | null) =>
                paymentId && (
                  <Link to={`${AppUrl.Payments}/${paymentId}`}>Ver Pago</Link>
                ),
              title: 'Pago',
              width: 75,
            },
            {
              align: 'center',
              dataIndex: 'status',
              defaultFilteredValue: [MovementStatusEnum.REGISTERED],
              ellipsis: true,
              filterResetToDefaultFilteredValue: true,
              filteredValue: gridState.filters.status,
              filters: getMovementStatusColumnFilters(),
              render: (status: MovementStatusEnum) =>
                MovementStatusLabel[status],
              title: 'Estado',
              width: 100,
            },
            {
              dataIndex: 'notes',
              render: (notes: string) => (
                <Typography.Paragraph
                  className="!mb-0"
                  ellipsis={{ expandable: true }}
                >
                  {notes}
                </Typography.Paragraph>
              ),
              title: 'Detalle',
              width: 300,
            },
          ]}
        />
      </Card>
    </>
  );
};
