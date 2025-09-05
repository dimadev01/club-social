import { Card, Space } from 'antd';
import { ColumnType } from 'antd/es/table';
import React from 'react';
import { Link } from 'react-router-dom';

import { PriceDto } from '@application/prices/dtos/price.dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import {
  MemberCategoryEnum,
  MemberCategoryLabel,
} from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrlGenericEnum } from '@ui/app.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { DueCategoryIcon } from '@ui/components/Dues/Dues.utils';
import { Grid } from '@ui/components/Grid/Grid';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useGrid } from '@ui/components/Grid/useGrid';
import { PricesIcon } from '@ui/components/Icons/PricesIcon';
import { Table } from '@ui/components/Table/Table';
import { usePermissions } from '@ui/hooks/auth/usePermissions';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';

export const PricesPage = () => {
  const permissions = usePermissions();

  const { gridState, onTableChange } = useGrid<PriceDto>({
    defaultFilters: {},
    defaultSorter: { dueCategory: 'descend' },
  });

  const gridRequest: GetGridRequestDto = {
    limit: gridState.pageSize,
    page: gridState.page,
    sorter: gridState.sorter,
  };

  const { data, isFetching, isRefetching, refetch } = useQueryGrid<
    GetGridRequestDto,
    PriceDto
  >({
    methodName: MeteorMethodEnum.PricesGetGrid,
    request: gridRequest,
  });

  const expandedRowRender = (price: PriceDto) => (
    <Table
      rowKey="category"
      columns={[
        {
          dataIndex: 'memberCategory',
          render: (memberCategory: MemberCategoryEnum) =>
            MemberCategoryLabel[memberCategory],
          title: 'Categoría',
          width: 100,
        },
        {
          align: 'right',
          dataIndex: 'amount',
          render: (amount) => Money.from({ amount }).formatWithCurrency(),
          title: 'Precio',
          width: 100,
        },
      ]}
      dataSource={price.categories}
    />
  );

  const getColumns = (): ColumnType<PriceDto>[] => {
    const columns: ColumnType<PriceDto>[] = [
      {
        dataIndex: 'dueCategory',
        ellipsis: true,
        render: (dueCategory: DueCategoryEnum, price: PriceDto) => {
          const content = (
            <div className="flex items-center gap-2">
              {DueCategoryIcon[dueCategory]}
              {DueCategoryLabel[dueCategory]}
            </div>
          );

          if (permissions.isAdmin || permissions.isStaff) {
            return (
              <Link
                to={`${price.id}/${AppUrlGenericEnum.EDIT}`}
                state={gridState}
              >
                {content}
              </Link>
            );
          }

          return content;
        },
        title: 'Categoría',
      },
    ];

    return columns;
  };

  return (
    <Card
      title={
        <Space>
          <PricesIcon />
          <span>Precios</span>
        </Space>
      }
      extra={
        <Space.Compact>
          <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
          <GridNewButton scope={ScopeEnum.PRICES} />
        </Space.Compact>
      }
    >
      <Grid<PriceDto>
        total={data?.totalCount}
        expandable={{
          expandedRowRender,
        }}
        state={gridState}
        onTableChange={onTableChange}
        loading={isFetching}
        dataSource={data?.items}
        columns={getColumns()}
      />
    </Card>
  );
};
