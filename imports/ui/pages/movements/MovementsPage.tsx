import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { NavLink } from 'react-router-dom';
import {
  MovementCategory,
  MovementCategoryLabel,
} from '@domain/movements/movements.enum';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMovementsGrid } from '@ui/hooks/movements/useMovementsGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MovementsPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const { data, isLoading, isRefetching, refetch } = useMovementsGrid({
    filters: gridState.filters,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Movimientos</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Movimientos"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <TableNewButton to={AppUrl.MovementsNew} />
          </>
        }
      >
        <Table<MovementGridDto>
          total={data?.total ?? 0}
          showSearch
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data}
          columns={[
            {
              dataIndex: 'date',
              render: (date: string, member: MovementGridDto) => (
                <NavLink to={`${AppUrl.Movements}/${member._id}`}>
                  {date}
                </NavLink>
              ),
              title: 'Fecha',
            },
            {
              align: 'center',
              dataIndex: 'category',
              render: (category: MovementCategory) =>
                MovementCategoryLabel[category],
              title: 'Categoría',
            },
          ]}
        />
      </Card>
    </>
  );
};
