import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Input } from 'antd';
import { NavLink } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { MemberGridDto } from '@domain/members/use-cases/get-members/member-grid.dto';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Grid } from '@ui/components/Grid';
import { useMembersGrid } from '@ui/hooks/members/useMembersGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MembersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'createdAt',
    sortOrder: 'descend',
  });

  const [search, setSearch] = useState(gridState.search);

  const [searchDebounced] = useDebounce(search, 750);

  useEffect(() => {
    setGridState((p) => ({ ...p, page: 1, search: searchDebounced }));
  }, [searchDebounced, setGridState]);

  const { data, isLoading, isRefetching, refetch } = useMembersGrid({
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
        <Breadcrumb.Item>Socios</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Socios"
        extra={
          <>
            <Button
              onClick={() => refetch()}
              loading={isRefetching}
              disabled={isRefetching}
              tooltip={{ title: 'Recargar' }}
              htmlType="button"
              type="ghost"
              icon={<ReloadOutlined />}
            />

            <NavLink to={AppUrl.MembersNew}>
              <Button
                icon={<PlusOutlined />}
                type="ghost"
                htmlType="button"
                tooltip={{ title: 'Nuevo' }}
              />
            </NavLink>
          </>
        }
      >
        <Input.Search
          placeholder="Buscar..."
          allowClear
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value ?? '')}
        />

        <Grid<MemberGridDto>
          total={data?.total ?? 0}
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data}
          columns={[
            {
              dataIndex: 'dateOfBirth',
              render: (dateOfBirth: string, member: MemberGridDto) => (
                <NavLink to={`${AppUrl.Members}/${member._id}`}>
                  {dateOfBirth}
                </NavLink>
              ),
              title: 'Fecha de nacimiento',
            },
            {
              dataIndex: 'name',
              title: 'Usuario',
            },
          ]}
        />
      </Card>
    </>
  );
};
