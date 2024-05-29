import { Breadcrumb, Card } from 'antd';
import React from 'react';

import { GetServicesResponseDto } from '@domain/services/use-cases/get-services/get-services-response.dto';
import { Table } from '@ui/components/Table/Table';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useServices } from '@ui/hooks/services/useServices';
import { useGrid } from '@ui/hooks/useGrid';

export const ServicesPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useServices();

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Servicios',
          },
        ]}
      />

      <Card
        title="Servicios"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<GetServicesResponseDto>
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
