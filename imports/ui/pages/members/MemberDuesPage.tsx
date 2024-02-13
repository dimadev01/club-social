import React, { useState } from 'react';
import {
  Card,
  DatePicker,
  Descriptions,
  Form,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { useLocation } from 'react-router-dom';
import invariant from 'ts-invariant';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusColor,
  DueStatusEnum,
  DueStatusLabel,
  getDueCategoryOptions,
  getDueStatusColumnFilters,
} from '@domain/dues/due.enum';
import { MemberDueGridDto } from '@domain/members/use-cases/get-member-dues-grid/member-due-grid.dto';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { Table } from '@ui/components/Table/Table';
import { useMemberDuesGrid } from '@ui/hooks/members/useMemberDuesGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MemberDuesPage = () => {
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

  const { data, isLoading } = useMemberDuesGrid({
    filters: gridState.filters,
    from: dateFilter
      ? dateFilter[0]?.format(DateFormatEnum.Date) ?? null
      : null,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField as 'createdAt',
    sortOrder: gridState.sortOrder,
    to: dateFilter ? dateFilter[1]?.format(DateFormatEnum.Date) ?? null : null,
  });

  const renderFooter = () => (
    <Descriptions>
      <Descriptions.Item label="Total deudas">
        {data?.totalDues}
      </Descriptions.Item>
      <Descriptions.Item label="Total pagos">
        {data?.totalPayments}
      </Descriptions.Item>
      <Descriptions.Item label="Balance">{data?.balance}</Descriptions.Item>
    </Descriptions>
  );

  return (
    <Card title="Mis Cobros">
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

        <Table<MemberDueGridDto>
          total={data?.count ?? 0}
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          footer={renderFooter}
          dataSource={data?.data}
          columns={[
            {
              dataIndex: 'date',
              defaultSortOrder:
                gridState.sortField === 'date'
                  ? gridState.sortOrder
                  : undefined,
              render: (date: string) => date,
              sorter: true,
              title: 'Fecha',
            },
            {
              align: 'center',
              dataIndex: 'category',
              filteredValue: gridState.filters?.category ?? [],
              filters: getDueCategoryOptions().map((category) => ({
                text: category.label,
                value: category.value,
              })),
              render: (category: DueCategoryEnum) => DueCategoryLabel[category],
              title: 'Categoría',
            },
            {
              align: 'center',
              dataIndex: 'membershipMonth',
              filteredValue: gridState.filters?.membershipMonth ?? [],
              filters: DateUtils.months().map((month) => ({
                text: month,
                value: month,
              })),
              title: 'Mes de cuota',
            },
            {
              align: 'right',
              dataIndex: 'amount',
              title: 'Importe',
            },
            {
              align: 'center',
              dataIndex: 'status',
              filteredValue: gridState.filters?.status ?? [],
              filters: getDueStatusColumnFilters(),
              render: (status: DueStatusEnum, due: MemberDueGridDto) => {
                if (due.isPaid) {
                  invariant(due.payments);

                  return (
                    <Tooltip
                      title={due.payments.map((d) => (
                        <span key={d.paidAt} className="block">
                          {d.paidAt}
                        </span>
                      ))}
                    >
                      <Tag color={DueStatusColor[status]}>
                        {DueStatusLabel[status]} ({due.paidAmount})
                      </Tag>
                    </Tooltip>
                  );
                }

                if (due.isPartiallyPaid) {
                  invariant(due.payments);

                  return (
                    <Tooltip
                      title={due.payments.map((d) => `${d.paidAt} ${d.amount}`)}
                    >
                      <Tag color={DueStatusColor[status]}>
                        {DueStatusLabel[status]} ({due.paidAmount})
                      </Tag>
                    </Tooltip>
                  );
                }

                return (
                  <Tag color={DueStatusColor[status]}>
                    {DueStatusLabel[status]}
                  </Tag>
                );
              },
              title: 'Estado',
            },
          ]}
        />
      </Space>
    </Card>
  );
};
