import React, { useState } from 'react';
import { Col, DatePicker, Row, Space, Table as AntTable, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryTypeEnum,
  getMemberCategoryFilters,
} from '@domain/categories/category.enum';
import { MemberMovementGridDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.dto';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { useMemberMovementsGrid } from '@ui/hooks/members/useMemberMovements';
import { useGrid } from '@ui/hooks/useGrid';

type Props = {
  memberId: string;
};

export const MemberMovementsGrid: React.FC<Props> = ({ memberId }) => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const [dateRangeValue, setDateRangeValue] =
    useState<RangeValue<Dayjs> | null>(
      parsedQs.from && parsedQs.to
        ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
        : null
    );

  const { data, isLoading } = useMemberMovementsGrid({
    filters: gridState.filters,
    from: dateRangeValue
      ? dateRangeValue[0]?.format(DateFormatEnum.Date) ?? null
      : null,
    memberId,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
    to: dateRangeValue
      ? dateRangeValue[1]?.format(DateFormatEnum.Date) ?? null
      : null,
  });

  const renderSummary = () => (
    <AntTable.Summary.Row>
      <AntTable.Summary.Cell index={0}>
        <div className="flex justify-between">
          <span>Deudas</span>
          <span>{data ? CurrencyUtils.formatCents(data.debt, false) : ''}</span>
        </div>
      </AntTable.Summary.Cell>

      <AntTable.Summary.Cell index={1}>
        <div className="flex justify-between">
          <span>Pagos</span>
          <span>
            {data ? CurrencyUtils.formatCents(data.income, false) : ''}
          </span>
        </div>
      </AntTable.Summary.Cell>

      <AntTable.Summary.Cell index={2}>
        <div className="flex justify-between">
          <span>Balance</span>
          <span>
            {data ? CurrencyUtils.formatCents(data.balance, false) : ''}
          </span>
        </div>
      </AntTable.Summary.Cell>
    </AntTable.Summary.Row>
  );

  return (
    <Space size="middle" direction="vertical" className="flex">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={10} lg={10} xl={8} xxl={6}>
          <DatePicker.RangePicker
            format={DateFormatEnum.DD_MM_YYYY}
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
      </Row>

      <Table<MemberMovementGridDto>
        total={data?.count ?? 0}
        gridState={gridState}
        onStateChange={setGridState}
        loading={isLoading}
        dataSource={data?.data}
        columns={[
          {
            dataIndex: 'date',
            render: (date: string, movement: MemberMovementGridDto) => (
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
            filters: getMemberCategoryFilters(),
            render: (category: CategoryEnum) => CategoryLabel[category],
            title: 'Categoría',
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: string, movement: MemberMovementGridDto) => {
              if (movement.type === CategoryTypeEnum.Expense) {
                return <Tag color="red">{amount}</Tag>;
              }

              if (movement.type === CategoryTypeEnum.Income) {
                return <Tag color="green">{amount}</Tag>;
              }

              return <Tag>{amount}</Tag>;
            },
            title: 'Importe',
          },
        ]}
        summary={renderSummary}
      />
    </Space>
  );
};
