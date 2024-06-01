import { Breadcrumb, Card } from 'antd';
import React from 'react';

import { Table } from '@adapters/ui/components/Table/Table';
import { TableReloadButton } from '@adapters/ui/components/Table/TableReloadButton';
import { useProfessors } from '@adapters/ui/hooks/professors/useProfessors';
import { useGrid } from '@adapters/ui/hooks/useGrid';
import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';

export const ProfessorsPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useProfessors();

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Profesores',
          },
        ]}
      />

      <Card
        title="Profesores"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<GetProfessorsResponseDto>
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
