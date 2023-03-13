import React, { useState } from 'react';
import { Card, Col, DatePicker, Row, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryType,
  getCategoryFilters,
} from '@domain/categories/categories.enum';
import { MovementByMemberGridDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.dto';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { useMovementsByMemberGrid } from '@ui/hooks/movements/useMovementsByMemberGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MemberDetailMovementsGrid = () => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const { id } = useParams<{ id?: string }>();

  const [dateRangeValue, setDateRangeValue] =
    useState<RangeValue<Dayjs> | null>(
      parsedQs.from && parsedQs.to
        ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
        : null
    );

  const { data, isLoading } = useMovementsByMemberGrid({
    filters: gridState.filters,
    from: dateRangeValue
      ? dateRangeValue[0]?.format(DateFormats.Date) ?? null
      : null,
    memberId: id ?? '',
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
    to: dateRangeValue
      ? dateRangeValue[1]?.format(DateFormats.Date) ?? null
      : null,
  });

  const renderFooter = () => (
    <Space direction="horizontal" className="flex justify-between">
      <Typography.Text>
        Deudas: {data ? CurrencyUtils.formatCents(data.debt, false) : ''}
      </Typography.Text>

      <Typography.Text>
        Pagos: {data ? CurrencyUtils.formatCents(data.income, false) : ''}
      </Typography.Text>

      <Typography.Text>
        Balance: {data ? CurrencyUtils.formatCents(data.balance, false) : ''}
      </Typography.Text>
    </Space>
  );

  return (
    <Card>
      <Space size="middle" direction="vertical" className="flex">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <DatePicker.RangePicker
              format={DateFormats.DD_MM_YYYY}
              className="w-full"
              allowClear
              value={dateRangeValue}
              onChange={(value) => setDateRangeValue(value)}
            />
          </Col>
        </Row>

        <Table<MovementByMemberGridDto>
          total={data?.count ?? 0}
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data}
          columns={[
            {
              dataIndex: 'date',
              render: (date: string, movement: MovementByMemberGridDto) => (
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
              render: (amount: string, movement: MovementByMemberGridDto) => {
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
          ]}
          footer={renderFooter}
        />

        {/* <ReactJson collapsed src={data?.$explain} /> */}
      </Space>
    </Card>
  );
};
