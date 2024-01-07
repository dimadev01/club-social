import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Space,
  Table as AntTable,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Meteor } from 'meteor/meteor';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { MemberPaymentDueGridDto } from '@domain/members/use-cases/get-member-payments-grid/member-payment-due-grid.dto';
import { MemberPaymentGridDto } from '@domain/members/use-cases/get-member-payments-grid/member-payment-grid.dto';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Table } from '@ui/components/Table/Table';
import { useMemberPaymentsGrid } from '@ui/hooks/members/useMemberPayments';
import { useGrid } from '@ui/hooks/useGrid';

DateUtils.extend();

export const MemberPaymentsPage = () => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const [dateFilter, setDateFilter] = useState<RangeValue<Dayjs> | null>(
    parsedQs.from && parsedQs.to
      ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
      : null
  );

  const { data, isLoading } = useMemberPaymentsGrid({
    filters: gridState.filters,
    from: dateFilter
      ? dateFilter[0]?.format(DateFormatEnum.Date) ?? null
      : null,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
    to: dateFilter ? dateFilter[1]?.format(DateFormatEnum.Date) ?? null : null,
  });

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const userId = Meteor.userId();

  if (!userId) {
    return null;
  }

  const expandedRowRender = (payment: MemberPaymentGridDto) => (
    <AntTable
      rowKey="dueId"
      pagination={false}
      bordered
      columns={[
        {
          dataIndex: 'dueDate',
          render: (dueDate: string, due: MemberPaymentDueGridDto) => (
            <NavLink to={`${AppUrl.Dues}/${due.dueId}`}>{dueDate}</NavLink>
          ),
          title: 'Fecha',
          width: 150,
        },
        {
          align: 'center',
          dataIndex: 'dueCategory',
          render: (dueCategory: DueCategoryEnum) =>
            DueCategoryLabel[dueCategory],
          title: 'Categoría',
        },
        {
          align: 'center',
          dataIndex: 'membershipMonth',
          title: 'Mes de cuota',
        },
        {
          align: 'right',
          dataIndex: 'dueAmount',
          title: 'Deuda',
        },
        {
          align: 'right',
          dataIndex: 'paymentAmount',
          title: 'Pagado',
        },
      ]}
      dataSource={payment.dues}
    />
  );

  const renderSummary = () => (
    <AntTable.Summary>
      <AntTable.Summary.Row>
        <AntTable.Summary.Cell index={0} />
        <AntTable.Summary.Cell index={1} />
        <AntTable.Summary.Cell index={2} />
        <AntTable.Summary.Cell index={3}>
          <div className="text-right">Total: {data?.totalAmount ?? '-'}</div>
        </AntTable.Summary.Cell>
      </AntTable.Summary.Row>
    </AntTable.Summary>
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Pagos' }]}
      />

      <Card title="Pagos">
        <Space size="middle" direction="vertical" className="flex">
          <Form layout="inline">
            <Space wrap>
              <Form.Item>
                <DatePicker.RangePicker
                  format={DateFormatEnum.DDMMYYYY}
                  allowClear
                  value={dateFilter}
                  disabledDate={(current) => current.isAfter(dayjs())}
                  onChange={(value) => {
                    setDateFilter(value);

                    setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                />
              </Form.Item>
            </Space>
          </Form>

          <Table<MemberPaymentGridDto>
            total={data?.count ?? 0}
            gridState={gridState}
            summary={renderSummary}
            onStateChange={setGridState}
            loading={isLoading}
            dataSource={data?.data}
            expandable={{ expandedRowRender }}
            columns={[
              {
                dataIndex: 'date',
                defaultSortOrder:
                  gridState.sortField === 'date'
                    ? gridState.sortOrder
                    : undefined,
                render: (date: string, payment: MemberPaymentGridDto) => (
                  <NavLink to={`${AppUrl.Payments}/${payment._id}`}>
                    {date}
                  </NavLink>
                ),
                sorter: true,
                title: 'Fecha',
                width: 150,
              },
              {
                align: 'right',
                dataIndex: 'count',
                title: '#',
              },
              {
                align: 'right',
                dataIndex: 'totalAmount',
                title: 'Total',
              },
            ]}
          />
        </Space>
      </Card>
    </>
  );
};
