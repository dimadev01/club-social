import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  MovementCategoryEnum,
  MovementCategoryEnumLabel,
  MovementStatusEnum,
  MovementStatusLabel,
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

export const MovementsPage = () => {
  const { state: gridState, onTableChange } = useTable<MovementGridDto>({
    defaultFilters: {
      category: [],
      status: [MovementStatusEnum.REGISTERED],
    },
    defaultSorter: { createdAt: 'descend' },
  });

  const gridRequest: GetMovementsGridRequestDto = {
    filterByCategory: gridState.filters.category as MovementCategoryEnum[],
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

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Movimientos' }]}
      />

      <Card
        title={
          <Space>
            <FaExchangeAlt />
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
          columns={[
            {
              dataIndex: 'createdAt',
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
              render: (date: string) => new DateUtcVo(date).format(),
              title: 'Fecha de mov.',
              width: 125,
            },
            {
              align: 'center',
              dataIndex: 'category',
              filteredValue: gridState.filters.category,
              filters: getCategoryFilters(),
              render: (category: MovementCategoryEnum) =>
                MovementCategoryEnumLabel[category],
              title: 'Categoría',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'amount',
              render: (amount) => new Money({ amount }).formatWithCurrency(),
              title: 'Importe',
              width: 150,
            },
            {
              align: 'center',
              dataIndex: 'status',
              defaultFilteredValue: [MovementStatusEnum.REGISTERED],
              filterResetToDefaultFilteredValue: true,
              filteredValue: gridState.filters.status,
              filters: getMovementStatusColumnFilters(),
              render: (status: MovementStatusEnum) =>
                MovementStatusLabel[status],
              title: 'Estado',
              width: 150,
            },
            {
              dataIndex: 'notes',
              render: (notes: string) => notes,
              title: 'Detalle',
            },
          ]}
        />
      </Card>
    </>
  );
};
