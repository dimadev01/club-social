import {
  CloseOutlined,
  DeleteOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { FindPaginatedPaymentsResponse } from '@domain/payments/repositories/find-paginated-payments.interface';
import { Table as AntTable, Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { AppUrl } from '@adapters/ui/app.enum';
import { Button } from '@adapters/ui/components/Button';
import { Grid } from '@adapters/ui/components/Table/TableNew';
import { TableNewButton } from '@adapters/ui/components/Table/TableNewButton';
import { TableReloadButton } from '@adapters/ui/components/Table/TableReloadButton';
import { useMembers } from '@adapters/ui/hooks/members/useMembers';
import { useDeletePayment } from '@adapters/ui/hooks/payments/useDeletePayment';
import { useQueryGrid } from '@adapters/ui/hooks/useQueryGrid';
import { useTable } from '@adapters/ui/hooks/useTable';
import { PaymentGridModelDto } from '@application/payments/dtos/payment-grid-model-dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { GetPaymentsGridRequestDto } from '@infra/controllers/payment/get-payments-grid-request.dto';
import { SecurityUtils } from '@infra/security/security.utils';

export const PaymentsPage = () => {
  const { gridState, setGridState, setState } = useTable<PaymentGridModelDto>({
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
        <Grid<PaymentGridModelDto>
          state={gridState}
          setGridState={setGridState}
          loading={isLoading}
          dataSource={payments?.items}
          expandable={{ expandedRowRender }}
          columns={[
            {
              dataIndex: 'date',
              render: (date: string, payment: PaymentGridModelDto) => (
                <Link to={`${AppUrl.Payments}/${payment._id}`}>
                  {new DateUtcVo(date).format()}
                </Link>
              ),
              title: 'Fecha',
              width: 125,
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

                  {!gridState.filters?.memberId && (
                    <Button
                      type="text"
                      disabled={!payment.memberId}
                      onClick={() => {
                        if (payment.memberId) {
                          setState({
                            ...gridState,
                            filters: { memberId: [payment.memberId] },
                          });
                        }
                      }}
                      htmlType="button"
                      tooltip={{ title: 'Filtrar por este socio' }}
                      icon={<FilterOutlined />}
                    />
                  )}

                  {gridState.filters?.memberId && (
                    <Button
                      type="text"
                      disabled={!payment.memberId}
                      onClick={() => {
                        setState({
                          ...gridState,
                          filters: { memberId: undefined },
                        });
                      }}
                      htmlType="button"
                      tooltip={{ title: 'Quitar filtro' }}
                      icon={<CloseOutlined />}
                    />
                  )}
                </Space.Compact>
              ),
              title: 'Acciones',
              width: 100,
            },
          ]}
        />
      </Card>
    </>
  );
};
