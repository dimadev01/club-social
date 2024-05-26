import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Space,
  Table as AntTable,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import { DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { PaymentDueGridDto } from '@domain/payments/use-cases/get-payments-grid/payment-due-grid.dto';
import { PaymentGridDto } from '@domain/payments/use-cases/get-payments-grid/payment-grid.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { usePaymentGrid } from '@ui/hooks/payments/usePaymentsGrid';
import { useGrid } from '@ui/hooks/useGrid';
import { MembersSelect } from '@ui/components/Members/MembersSelect';

DateUtils.extend();

export const PaymentsPage = () => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const [memberIdsFilter, setMemberIdsFilter] = useState<string[]>(
    (parsedQs.memberIds as string[]) ?? [],
  );

  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<RangeValue<Dayjs> | null>(
    parsedQs.from && parsedQs.to
      ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
      : null,
  );

  const { data, isLoading, isRefetching, refetch } = usePaymentGrid({
    filters: gridState.filters,
    from: dateFilter
      ? dateFilter[0]?.format(DateFormatEnum.Date) ?? null
      : null,
    memberIds: memberIdsFilter ?? [],
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    showDeleted,
    sortField: gridState.sortField as 'createdAt',
    sortOrder: gridState.sortOrder,
    to: dateFilter ? dateFilter[1]?.format(DateFormatEnum.Date) ?? null : null,
  });

  const deletePayment = useDeletePayment(refetch);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const userId = Meteor.userId();

  if (!userId) {
    return null;
  }

  const expandedRowRender = (payment: PaymentGridDto) => (
    <AntTable
      rowKey="dueId"
      pagination={false}
      bordered
      columns={[
        {
          dataIndex: 'dueDate',
          render: (dueDate: string, due: PaymentDueGridDto) => (
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
        <AntTable.Summary.Cell index={3} />
        <AntTable.Summary.Cell index={4}>
          <div className="text-right">Total {data?.totalAmount ?? '-'}</div>
        </AntTable.Summary.Cell>
        <AntTable.Summary.Cell index={5} />
        <AntTable.Summary.Cell index={6} />
      </AntTable.Summary.Row>
    </AntTable.Summary>
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Pagos' }]}
      />

      <Card
        title="Pagos"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            {Roles.userIsInRole(
              user,
              PermissionEnum.Create,
              ScopeEnum.Payments,
            ) && <TableNewButton to={AppUrl.PaymentsNew} />}
          </>
        }
      >
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

              <Form.Item>
                <MembersSelect
                  value={memberIdsFilter}
                  mode="multiple"
                  onChange={(value) => {
                    setMemberIdsFilter(value ?? null);

                    setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                  className="!min-w-[333px]"
                />
              </Form.Item>

              {Roles.userIsInRole(
                userId,
                PermissionEnum.ViewDeleted,
                ScopeEnum.Movements,
              ) && (
                <Form.Item>
                  <Checkbox
                    checked={showDeleted}
                    onChange={(e) => setShowDeleted(e.target.checked)}
                  >
                    Ver eliminados
                  </Checkbox>
                </Form.Item>
              )}
            </Space>
          </Form>

          <Table<PaymentGridDto>
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
                render: (date: string, payment: PaymentGridDto) => (
                  <NavLink to={`${AppUrl.Payments}/${payment._id}`}>
                    {date}
                  </NavLink>
                ),
                sorter: true,
                title: 'Fecha',
                width: 150,
              },
              {
                dataIndex: 'memberId',
                render: (memberId: string, dto: PaymentGridDto) => (
                  <NavLink to={`${AppUrl.Members}/${memberId}`}>
                    {dto.memberName}
                  </NavLink>
                ),
                title: 'Socio',
              },
              {
                align: 'right',
                dataIndex: 'count',
                title: '#',
                width: 50,
              },
              {
                align: 'right',
                dataIndex: 'totalAmount',
                title: 'Total',
                width: 150,
              },
              {
                align: 'right',
                dataIndex: 'receiptNumber',
                title: 'Recibo #',
                width: 100,
              },
              {
                align: 'center',
                render: (_, payment: PaymentGridDto) => (
                  <ButtonGroup size="small">
                    {!payment.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        PermissionEnum.Delete,
                        ScopeEnum.Payments,
                      ) && (
                        <Button
                          popConfirm={{
                            onConfirm: () =>
                              deletePayment.mutate(
                                { id: payment._id },
                                {
                                  onError: () => deletePayment.reset(),
                                  onSuccess: () => deletePayment.reset(),
                                },
                              ),
                            title: '¿Está seguro de eliminar este pago?',
                          }}
                          type="text"
                          htmlType="button"
                          tooltip={{ title: 'Eliminar' }}
                          icon={<DeleteOutlined />}
                          loading={deletePayment.variables?.id === payment._id}
                          disabled={deletePayment.variables?.id === payment._id}
                        />
                      )}

                    <Button
                      type="text"
                      disabled={!payment.memberId}
                      onClick={() => {
                        if (payment.memberId) {
                          setMemberIdsFilter([payment.memberId]);
                        }
                      }}
                      htmlType="button"
                      tooltip={{ title: 'Filtrar por este socio' }}
                      icon={<FilterOutlined />}
                    />
                  </ButtonGroup>
                ),
                title: 'Acciones',
                width: 100,
              },
            ]}
          />
        </Space>
      </Card>
    </>
  );
};
