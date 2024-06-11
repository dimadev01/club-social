import { SwapOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Space, Typography } from 'antd';
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
  getCategoryFilters,
  getMovementStatusColumnFilters,
} from '@domain/categories/category.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { MovementsGridCsvDownloaderButton } from '@ui/components/Movements/MovementsGridCsvDownloader';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';

export const MovementsPage = () => {
  const { gridState, onTableChange } = useTable<MovementGridDto>({
    defaultFilters: {
      category: [],
      createdAt: [],
      date: [],
      status: [MovementStatusEnum.REGISTERED],
    },
    defaultSorter: { createdAt: 'descend' },
  });

  const gridRequest: GetMovementsGridRequestDto = {
    filterByCategory: gridState.filters.category as MovementCategoryEnum[],
    filterByCreatedAt: gridState.filters.createdAt,
    filterByDate: gridState.filters.date,
    filterByStatus: gridState.filters.status as MovementStatusEnum[],
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
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
          rowClassName={(movement) => {
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
              fixed: 'left',
              render: (date: string, movement: MovementGridDto) => (
                <Link to={`${AppUrl.Movements}/${movement.id}`}>
                  {new DateUtcVo(date).format(DateFormatEnum.DDMMYYHHmm)}
                </Link>
              ),
              sortOrder: gridState.sorter.createdAt,
              sorter: true,
              title: 'Fecha de creación',
              width: 175,
            },
            {
              dataIndex: 'date',
              ellipsis: true,
              filterDropdown: renderDateFilter,
              filteredValue: gridState.filters.date,
              render: (date: string) => new DateUtcVo(date).format(),
              title: 'Fecha de movimiento',
              width: 120,
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
              width: 125,
            },
            {
              align: 'right',
              dataIndex: 'amount',
              ellipsis: true,
              render: (amount) => new Money({ amount }).formatWithCurrency(),
              title: 'Importe',
              width: 100,
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
