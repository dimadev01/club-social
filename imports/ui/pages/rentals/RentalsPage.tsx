import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';
import { Table } from '@ui/components/Table/Table';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useRentals } from '@ui/hooks/rentals/rentals';
import { useGrid } from '@ui/hooks/useGrid';

export const RentalsPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useRentals();

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Alquileres</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Alquileres"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<GetEmployeesResponseDto>
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
