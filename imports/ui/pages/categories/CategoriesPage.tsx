import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { NavLink } from 'react-router-dom';
import { CategoryGridDto } from '@domain/categories/use-cases/get-categories-grid/category-grid.dto';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useCategoriesGrid } from '@ui/hooks/categories/useCategoriesGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const CategoriesPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useCategoriesGrid({
    filters: gridState.filters,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Categorías',
          },
        ]}
      />

      <Card
        title="Categorías"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<CategoryGridDto>
          total={data?.count ?? 0}
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data ?? []}
          columns={[
            {
              dataIndex: 'name',
              render: (name: string, category: CategoryGridDto) =>
                category.price ? (
                  <NavLink to={`${AppUrl.Categories}/${category._id}`}>
                    {name}
                  </NavLink>
                ) : (
                  name
                ),
              title: 'Nombre',
            },
            {
              align: 'right',
              dataIndex: 'priceFormatted',
              title: 'Precio',
            },
          ]}
        />
      </Card>
    </>
  );
};
