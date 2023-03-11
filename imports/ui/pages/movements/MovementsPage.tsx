import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { NavLink, useLocation } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryType,
  getCategoryFilters,
  MemberCategories,
} from '@domain/categories/categories.enum';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Select } from '@ui/components/Select';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeleteMovement } from '@ui/hooks/movements/useDeleteMovement';
import { useMovementsGrid } from '@ui/hooks/movements/useMovementsGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MovementsPage = () => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const [memberIdSearchValue, setMemberIdSearchValue] = useState<string>(
    (parsedQs.memberId as string) ?? undefined
  );

  const [dateRangeValue, setDateRangeValue] =
    useState<RangeValue<Dayjs> | null>(
      parsedQs.from && parsedQs.to
        ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
        : null
    );

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const { data, isLoading, isRefetching, refetch } = useMovementsGrid({
    filters: gridState.filters,
    from: dateRangeValue
      ? dateRangeValue[0]?.format(DateFormats.Date) ?? null
      : null,
    memberId: memberIdSearchValue ?? null,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
    to: dateRangeValue
      ? dateRangeValue[1]?.format(DateFormats.Date) ?? null
      : null,
  });

  const deleteMovement = useDeleteMovement(refetch);

  const renderFooter = () => (
    <Space direction="horizontal" className="flex justify-between">
      <Typography.Text>
        Deudas: {data ? CurrencyUtils.formatCents(data.debt, false) : ''}
      </Typography.Text>

      <Typography.Text>
        Entrada: {data ? CurrencyUtils.formatCents(data.income, false) : ''}
      </Typography.Text>

      <Typography.Text>
        Salida: {data ? CurrencyUtils.formatCents(data.expense, false) : ''}
      </Typography.Text>

      <Typography.Text>
        Balance: {data ? CurrencyUtils.formatCents(data.balance, false) : ''}
      </Typography.Text>
    </Space>
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Movimientos',
          },
        ]}
      />

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
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <DatePicker.RangePicker
                format={DateFormats.DD_MM_YYYY}
                className="w-full"
                allowClear
                value={dateRangeValue}
                disabledDate={(current) => current.isAfter(dayjs())}
                onChange={(value) => {
                  setDateRangeValue(value);

                  setGridState((prevState) => ({ ...prevState, page: 1 }));
                }}
              />
            </Col>

            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <Select
                value={memberIdSearchValue}
                onChange={(value) => {
                  setMemberIdSearchValue(value ?? undefined);

                  setGridState((prevState) => ({ ...prevState, page: 1 }));
                }}
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
                render: (date: string, movement: MovementGridDto) => (
                  <NavLink to={`${AppUrl.Movements}/${movement._id}`}>
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
                render: (amount: string, movement: MovementGridDto) => {
                  if (movement.type === CategoryType.Expense) {
                    return <Tag color="red">{amount}</Tag>;
                  }

                  if (movement.type === CategoryType.Income) {
                    return <Tag color="green">{amount}</Tag>;
                  }

                  return <Tag>{amount}</Tag>;
                },
                title: 'Importe',
              },
              {
                dataIndex: 'details',
                render: (details: string | null, movement: MovementGridDto) => {
                  if (MemberCategories.includes(movement.category)) {
                    return (
                      <NavLink to={`${AppUrl.Members}/${movement.memberId}`}>
                        {details}
                      </NavLink>
                    );
                  }

                  return details;
                },
                title: 'Detalle',
              },
              {
                align: 'center',
                render: (_, movement: MovementGridDto) => (
                  <Button
                    popConfirm={{
                      onConfirm: () =>
                        deleteMovement.mutate(
                          { id: movement._id },
                          { onError: () => deleteMovement.reset() }
                        ),
                      title: '¿Está seguro de eliminar este movimiento?',
                    }}
                    type="ghost"
                    htmlType="button"
                    tooltip={{ title: 'Eliminar ' }}
                    icon={<DeleteOutlined />}
                    loading={deleteMovement.variables?.id === movement._id}
                    disabled={deleteMovement.variables?.id === movement._id}
                  />
                ),
                title: 'Actions',
                width: 100,
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
