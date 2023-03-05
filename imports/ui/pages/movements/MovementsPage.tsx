import React, { useState } from 'react';
import { Breadcrumb, Card, Col, Row, Slider, Space, Typography } from 'antd';
import qs from 'qs';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  CategoryEnum,
  CategoryLabel,
  getCategoryFilters,
} from '@domain/categories/categories.enum';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { AppUrl } from '@ui/app.enum';
import { Select } from '@ui/components/Select';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useMovementsGrid } from '@ui/hooks/movements/useMovementsGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MovementsPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const [memberIdSearchValue, setMemberIdSearchValue] = useState<string>(
    (parsedQs.memberId as string) ?? undefined
  );

  const [amountSliderSearchValue, setAmountSliderSearchValue] = useState<
    [number, number]
  >([
    parsedQs.amountFilter ? Number((parsedQs.amountFilter as string[])[0]) : 0,
    parsedQs.amountFilter ? Number((parsedQs.amountFilter as string[])[1]) : 0,
  ]);

  const [debouncedAmountSliderSearchValue] = useDebounce(
    amountSliderSearchValue,
    1000
  );

  const { data, isLoading, isRefetching, refetch } = useMovementsGrid({
    amountFilter: debouncedAmountSliderSearchValue,
    filters: gridState.filters,
    memberId: memberIdSearchValue ?? null,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  const renderFooter = () => (
    <Space direction="horizontal" className="flex justify-between">
      <Typography.Text>
        Ingresos: {data ? CurrencyUtils.formatCents(data.income) : ''}
      </Typography.Text>

      <Typography.Text>
        Egresos: {data ? CurrencyUtils.formatCents(data.outcome) : ''}
      </Typography.Text>

      <Typography.Text>
        Balance: {data ? CurrencyUtils.formatCents(data.balance) : ''}
      </Typography.Text>
    </Space>
  );

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Movimientos</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Movimientos"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <TableNewButton to={AppUrl.MovementsNew} />
          </>
        }
      >
        <Space size="middle" direction="vertical" className="flex">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <Select
                value={memberIdSearchValue}
                onChange={(value) => setMemberIdSearchValue(value ?? undefined)}
                className="w-full"
                disabled={isLoadingMembers || isLoading}
                loading={isLoadingMembers}
                placeholder="Buscar por socios"
                options={
                  members?.map((member: GetMembersDto) => ({
                    label: member.name,
                    value: member._id,
                  })) ?? []
                }
              />
            </Col>

            <Col xs={24} sm={6}>
              <Slider
                range={{ draggableTrack: true }}
                min={0}
                max={50000}
                step={2000}
                tooltip={{
                  formatter: (value: number | undefined) =>
                    CurrencyUtils.format(value ?? 0, false),
                }}
                onChange={(value: [number, number]) =>
                  setAmountSliderSearchValue(value)
                }
                value={amountSliderSearchValue}
              />
            </Col>
          </Row>

          <Table<MovementGridDto>
            total={data?.count ?? 0}
            gridState={gridState}
            onStateChange={setGridState}
            loading={isLoading}
            dataSource={data?.data}
            columns={[
              {
                dataIndex: 'date',
                render: (date: string, member: MovementGridDto) => (
                  <NavLink to={`${AppUrl.Movements}/${member._id}`}>
                    {date}
                  </NavLink>
                ),
                title: 'Fecha',
              },
              {
                align: 'center',
                dataIndex: 'category',
                filteredValue: gridState.filters?.category ?? [],
                filters: getCategoryFilters(),
                render: (category: CategoryEnum) => CategoryLabel[category],
                title: 'Categoría',
              },
              {
                align: 'right',
                dataIndex: 'amount',
                title: 'Importe',
              },
              {
                dataIndex: 'details',
                render: (details: string | null, movement: MovementGridDto) => {
                  if (movement.category === CategoryEnum.Membership) {
                    return (
                      <Link to={`${AppUrl.Members}/${movement.memberId}`}>
                        {details}
                      </Link>
                    );
                  }

                  return details;
                },
                title: 'Detalle',
              },
            ]}
            footer={renderFooter}
          />

          {/* <ReactJson collapsed src={data?.$explain} /> */}
        </Space>
      </Card>
    </>
  );
};
