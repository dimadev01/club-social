import { Card, Space } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { PriceDto } from '@application/prices/dtos/price.dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import {
  MemberCategoryEnum,
  MemberCategoryLabel,
} from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
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
  const navigate = useNavigate();

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

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetGridRequestDto,
    PriceDto
  >({
    methodName: MeteorMethodEnum.PricesGetGrid,
    request: gridRequest,
  });

  const expandedRowRender = (price: PriceDto) => (
    <Table
      title={() => 'Precios por Categoría'}
      rowKey="category"
      columns={[
        {
          dataIndex: 'category',
          render: (category: MemberCategoryEnum) =>
            MemberCategoryLabel[category],
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

  return (
    <Card
      title={
        <Space>
          <PricesIcon />
          <span>Movimientos</span>
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
        expandable={{ expandedRowRender }}
        state={gridState}
        onTableChange={onTableChange}
        loading={isLoading}
        dataSource={data?.items}
        columns={[
          {
            dataIndex: 'dueCategory',
            ellipsis: true,
            render: (dueCategory: DueCategoryEnum, price: PriceDto) => (
              <Link to={price.id}>
                <Space>
                  {DueCategoryIcon[dueCategory]}
                  {DueCategoryLabel[dueCategory]}
                </Space>
              </Link>
            ),
            title: 'Categoría',
            width: 75,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            ellipsis: true,
            render: (amount: number) =>
              Money.from({ amount }).formatWithCurrency(),
            title: 'Precio base',
            width: 100,
          },
          // {
          //   dataIndex: 'createdAt',
          //   ellipsis: true,
          //   filterDropdown: renderCreatedAtFilter,
          //   filteredValue: gridState.filters.createdAt,
          //   render: (date: string, price: PriceGridDto) => (
          //     <Link to={price.id} state={gridState}>
          //       {new DateTimeVo(date).format(DateFormatEnum.DDMMYYHHmm)}
          //     </Link>
          //   ),
          //   sortOrder: gridState.sorter.createdAt,
          //   sorter: true,
          //   title: 'Fecha de creación',
          //   width: 150,
          // },

          // {
          //   dataIndex: 'date',
          //   ellipsis: true,
          //   filterDropdown: renderDateFilter,
          //   filteredValue: gridState.filters.date,
          //   render: (date: string) => new DateVo(date).format(),
          //   title: 'Fecha de movimiento',
          //   width: 100,
          // },
          // {
          //   align: 'center',
          //   dataIndex: 'type',
          //   ellipsis: true,
          //   filteredValue: gridState.filters.type,
          //   filters: getPriceTypeOptions(),
          //   render: (type: PriceTypeEnum) => PriceTypeLabel[type],
          //   title: 'Tipo',
          //   width: 75,
          // },
          // {
          //   align: 'center',
          //   dataIndex: 'category',
          //   ellipsis: true,
          //   filterMode: 'tree',
          //   filteredValue: gridState.filters.category,
          //   filters: getCategoryFilters(),
          //   render: (category: PriceCategoryEnum) =>
          //     PriceCategoryLabel[category],
          //   title: 'Categoría',
          //   width: 125,
          // },
          // {
          //   align: 'right',
          //   dataIndex: 'amount',
          //   ellipsis: true,
          //   render: (amount) => Money.from({ amount }).formatWithCurrency(),
          //   title: 'Importe',
          //   width: 75,
          // },
          // {
          //   dataIndex: 'paymentMemberName',
          //   ellipsis: true,
          //   title: 'Socio',
          //   width: 125,
          // },
          // {
          //   align: 'center',
          //   dataIndex: 'status',
          //   defaultFilteredValue: [PriceStatusEnum.REGISTERED],
          //   ellipsis: true,
          //   filterResetToDefaultFilteredValue: true,
          //   filteredValue: gridState.filters.status,
          //   filters: getPriceStatusColumnFilters(),
          //   render: (status: PriceStatusEnum) => PriceStatusLabel[status],
          //   title: 'Estado',
          //   width: 100,
          // },
          // {
          //   dataIndex: 'notes',
          //   render: (notes: string) => (
          //     <Typography.Paragraph
          //       className="!mb-0"
          //       ellipsis={{ expandable: true }}
          //     >
          //       {notes}
          //     </Typography.Paragraph>
          //   ),
          //   title: 'Notas',
          //   width: 150,
          // },
        ]}
      />
    </Card>
  );
};
