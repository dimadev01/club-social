import { Card, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { UserGridDto } from '@application/users/dtos/user-grid.dto';
import { RoleEnum, RoleLabel, ScopeEnum } from '@domain/roles/role.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useGrid } from '@ui/components/Grid/useGrid';
import { UsersIcon } from '@ui/components/Icons/UsersIcon';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';

export const UsersPage = () => {
  const { gridState, onTableChange, clearFilters, resetFilters } =
    useGrid<UserGridDto>({
      defaultFilters: {},
      defaultSorter: { name: 'ascend' },
    });

  const sorter = { ...gridState.sorter };

  if (sorter.name) {
    sorter['profile.lastName'] = sorter.name;

    delete sorter.lastName;
  }

  const gridRequest: GetGridRequestDto = {
    limit: gridState.pageSize,
    page: gridState.page,
    sorter,
  };

  const { data, isFetching, isRefetching, refetch } = useQueryGrid<
    GetGridRequestDto,
    UserGridDto
  >({
    methodName: MeteorMethodEnum.UsersGetGrid,
    request: gridRequest,
  });

  return (
    <Card
      title={
        <Space>
          <UsersIcon />
          <span>Usuarios</span>
        </Space>
      }
      extra={
        <Space.Compact>
          <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
          <GridNewButton scope={ScopeEnum.USERS} />
        </Space.Compact>
      }
    >
      <Grid<UserGridDto>
        clearFilters={clearFilters}
        resetFilters={resetFilters}
        total={data?.totalCount}
        state={gridState}
        onTableChange={onTableChange}
        loading={isFetching}
        dataSource={data?.items}
        columns={[
          {
            dataIndex: 'name',
            ellipsis: true,
            render: (name: string, user: UserGridDto) => (
              <Link to={user.id} state={gridState}>
                {name}
              </Link>
            ),
            sortOrder: gridState.sorter.name,
            sorter: true,
            title: 'Nombre',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'role',
            ellipsis: true,
            render: (role: RoleEnum) => RoleLabel[role],
            title: 'Rol',
            width: 75,
          },
        ]}
      />
    </Card>
  );
};
