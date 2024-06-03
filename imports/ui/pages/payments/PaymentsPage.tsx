import { DeleteOutlined } from '@ant-design/icons';
import { Table as AntTable, Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { GetPaymentsGridRequest } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.request';
import { GetPaymentsGridResponse } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.response';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { TableFilterByMemberButton } from '@ui/components/Table/TableFilterByMember';
import { Grid } from '@ui/components/Table/TableNew';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const PaymentsPage = () => {
  const { gridState, onTableChange, setState } = useTable<PaymentGridDto>({
    defaultSorter: { date: 'descend' },
  });

  const { data: members } = useMembers({});

  const {
    data: payments,
    isLoading,
    refetch,
    isRefetching,
  } = useQueryGrid<GetPaymentsGridRequest, GetPaymentsGridResponse>({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      filterByMember: gridState.filters?.memberId,
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const deletePayment = useDeletePayment();

  const expandedRowRender = (payment: PaymentGridDto) => (
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
          align: 'right',
          dataIndex: 'dueAmount',
          render: (amount) => new Money({ amount }).formatWithCurrency(),
          title: 'Deuda',
        },
        {
          align: 'right',
          dataIndex: 'amount',
          render: (amount) => new Money({ amount }).formatWithCurrency(),
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
        <Grid<PaymentGridDto>
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={payments?.items}
          expandable={{ expandedRowRender }}
          columns={[
            {
              dataIndex: 'date',
              render: (date: string, payment: PaymentGridDto) => (
                <Link to={`${AppUrl.Payments}/${payment.id}`}>
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
                  value: member.id,
                })) ?? [],
              render: (_, payment: PaymentGridDto) => payment.memberName,
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
                new Money({ amount: totalAmount }).formatWithCurrency(),
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
                              { id: payment.id },
                              {
                                onError: () => deletePayment.reset(),
                                onSuccess: () => {
                                  deletePayment.reset();

                                  refetch();
                                },
                              },
                            ),
                          title: '¿Está seguro de eliminar este pago?',
                        }}
                        type="text"
                        htmlType="button"
                        tooltip={{ title: 'Eliminar' }}
                        icon={<DeleteOutlined />}
                        loading={deletePayment.variables?.id === payment.id}
                        disabled={deletePayment.variables?.id === payment.id}
                      />
                    )}

                  <TableFilterByMemberButton
                    gridState={gridState}
                    setState={setState}
                    memberId={payment.memberId}
                  />
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
