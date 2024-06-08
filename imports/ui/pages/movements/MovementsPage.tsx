import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  MovementCategoryEnum,
  MovementCategoryEnumLabel,
} from '@domain/categories/category.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';

export const MovementsPage = () => {
  const { state: gridState, onTableChange } = useTable<MovementGridDto>({
    defaultFilters: {},
    defaultSorter: { date: 'descend' },
  });

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetGridRequestDto,
    MovementGridDto
  >({
    methodName: MeteorMethodEnum.MovementsGetGrid,
    request: {
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
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
          <>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <GridNewButton
              scope={ScopeEnum.MOVEMENTS}
              to={AppUrl.MovementsNew}
            />
          </>
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
              dataIndex: 'date',
              render: (date: string, movement: MovementGridDto) => (
                <Link to={`${AppUrl.Movements}/${movement.id}`}>
                  {new DateUtcVo(date).format()}
                </Link>
              ),
              sortOrder: gridState.sorter.date,
              sorter: true,
              title: 'Fecha',
              width: 125,
            },
            {
              align: 'center',
              dataIndex: 'category',
              render: (category: MovementCategoryEnum) =>
                MovementCategoryEnumLabel[category],
              title: 'Categoría',
            },
            {
              align: 'right',
              dataIndex: 'amount',
              render: (amount) => new Money({ amount }).formatWithCurrency(),
              title: 'Importe',
              width: 150,
            },
          ]}
        />
      </Card>
    </>
  );
};
