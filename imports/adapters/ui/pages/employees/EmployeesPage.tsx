import { Breadcrumb, Card } from 'antd';
import React from 'react';

import { Table } from '@adapters/ui/components/Table/Table';
import { TableReloadButton } from '@adapters/ui/components/Table/TableReloadButton';
import { useEmployees } from '@adapters/ui/hooks/employees/useEmployees';
import { useGrid } from '@adapters/ui/hooks/useGrid';
import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';

export const EmployeesPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useEmployees();

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Empleados',
          },
        ]}
      />

      <Card
        title="Empleados"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<GetEmployeesResponseDto>
          total={data?.length ?? 0}
          gridState={gridState}
          onChange={setGridState}
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
