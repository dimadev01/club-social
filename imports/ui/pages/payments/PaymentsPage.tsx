import { DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import {
  Table as AntTable,
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Space,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { FindPaginatedPaymentsResponse } from '@domain/payments/repositories/find-paginated-payments.interface';
import { PaymentGridModelDto } from '@domain/payments/use-cases/get-payments-grid/payment-grid-model-dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { GetPaymentsGridRequestDto } from '@infra/controllers/payment/get-payments-grid-request.dto';
import { SecurityUtils } from '@infra/security/security.utils';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { MembersSelect } from '@ui/components/Members/MembersSelect';
import { TableNewV } from '@ui/components/Table/TableNew';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const PaymentsPage = () => {
  const { gridState, setGridState } = useTable<PaymentGridModelDto>({
    defaultSorter: { date: 'descend' },
  });

  const { data: members } = useMembers({});

  const {
    data: payments,
    isLoading,
    refetch,
    isRefetching,
  } = useQueryGrid<
    PaymentGridModelDto,
    FindPaginatedPaymentsResponse<PaymentGridModelDto>,
    GetPaymentsGridRequestDto
  >({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      filterByMember: gridState.filters?.memberId,
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [memberIdsFilter, setMemberIdsFilter] = useState<string[]>(
    (parsedQs.memberIds as string[]) ?? [],
  );

  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<RangeValue<Dayjs> | null>(
    parsedQs.from && parsedQs.to
      ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
      : null,
  );

  const deletePayment = useDeletePayment(refetch);

  const expandedRowRender = (payment: PaymentGridModelDto) => (
    <AntTable
      rowKey="_id"
      pagination={false}
      bordered
      columns={[
        {
          dataIndex: 'dueDate',
          render: (dueDate: string) => new DateUtcVo(dueDate).format(),
          title: 'Fecha',
          width: 150,
        },
        {
          align: 'center',
          dataIndex: 'dueCategory',
          render: (category: DueCategoryEnum) => DueCategoryLabel[category],
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
          dataIndex: 'amount',
          render: (amount) => new Money(amount).formatWithCurrency(),
          title: 'Monto Pago',
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
          <div className="text-right">Total -</div>
          {/* <div className="text-right">Total {data?.totalAmount ?? '-'}</div> */}
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

            {SecurityUtils.isInRole(
              PermissionEnum.CREATE,
              ScopeEnum.PAYMENTS,
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

                    // setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                />
              </Form.Item>

              <Form.Item>
                <MembersSelect
                  value={memberIdsFilter}
                  mode="multiple"
                  onChange={(value) => {
                    setMemberIdsFilter(value ?? null);

                    // setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                  className="!min-w-[333px]"
                />
              </Form.Item>
            </Space>
          </Form>

          <TableNewV<PaymentGridModelDto>
            state={gridState}
            // summary={renderSummary}
            setGridState={setGridState}
            loading={isLoading}
            dataSource={payments?.items}
            expandable={{ expandedRowRender }}
            columns={[
              {
                dataIndex: 'date',
                render: (date: string, payment: PaymentGridModelDto) => (
                  <>
                    <Link to={`${AppUrl.Payments}/${payment._id}`}>
                      {new DateUtcVo(date).format()}
                    </Link>
                    <Typography.Text className="flex" copyable>
                      {payment._id}
                    </Typography.Text>
                  </>
                ),
                title: 'Fecha',
                width: 250,
              },
              {
                dataIndex: 'memberId',
                filterSearch: true,
                filteredValue: gridState.filters?.memberId,
                filters:
                  members?.map((member) => ({
                    text: member.name,
                    value: member._id,
                  })) ?? [],
                render: (_, payment: PaymentGridModelDto) => payment.memberName,
                title: 'Socio',
              },
              {
                align: 'right',
                dataIndex: 'paymentDuesCount',
                title: '#',
                width: 50,
              },
              {
                align: 'right',
                dataIndex: 'totalAmount',
                render: (totalAmount: number) =>
                  new Money(totalAmount).formatWithCurrency(),
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
                render: (_, payment: PaymentGridModelDto) => (
                  <Space.Compact size="small">
                    {!payment.isDeleted &&
                      SecurityUtils.isInRole(
                        PermissionEnum.DELETE,
                        ScopeEnum.PAYMENTS,
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
                  </Space.Compact>
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
