import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { GetRentalsResponseDto } from '@domain/rentals/use-cases/get-rentals/get-rentals-response.dto';
import { Table } from '@ui/components/Table/Table';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useRentals } from '@ui/hooks/rentals/useRentals';
import { useGrid } from '@ui/hooks/useGrid';

export const RentalsPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useRentals();

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Alquileres',
          },
        ]}
      />

      <Card
        title="Alquileres"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<GetRentalsResponseDto>
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
          ]}
        />
      </Card>
    </>
  );
};
