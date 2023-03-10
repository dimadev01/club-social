import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';
import { Table } from '@ui/components/Table/Table';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useProfessors } from '@ui/hooks/professors/useProfessors';
import { useGrid } from '@ui/hooks/useGrid';

export const ProfessorsPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useProfessors();

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Profesores</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Profesores"
        extra={
          <TableReloadButton isRefetching={isRefetching} refetch={refetch} />
        }
      >
        <Table<GetProfessorsResponseDto>
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
