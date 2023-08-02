import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { GetCategoriesResponseDto } from '@application/use-cases/get-categories/get-categories-response.dto';
import { Table } from '@ui/components/Table/Table';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useCategories } from '@ui/hooks/categories/useCategories';
import { useGrid } from '@ui/hooks/useGrid';

export const CategoriesPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useCategories();

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
        <Table<GetCategoriesResponseDto>
          total={data?.length ?? 0}
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data}
          columns={[
            {
              dataIndex: 'name',
              title: 'Nombre',
            },
            {
              align: 'right',
              dataIndex: 'amount',
              title: 'Precio',
            },
          ]}
        />
      </Card>
    </>
  );
};
