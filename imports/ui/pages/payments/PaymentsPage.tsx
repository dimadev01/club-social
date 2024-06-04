import { DeleteOutlined } from '@ant-design/icons';
import { Table as AntTable, Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import invariant from 'tiny-invariant';

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
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const PaymentsPage = () => {
  const {
    state: gridState,
    onTableChange,
    setState,
  } = useTable<PaymentGridDto>({
    defaultFilters: { memberId: [] },
    defaultSorter: { date: 'descend' },
  });

  const { data: members } = useMembers();

  const { data, isLoading, refetch, isRefetching } = useQueryGrid<
    GetPaymentsGridRequest,
    GetPaymentsGridResponse<PaymentGridDto>
  >({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      filterByMember: gridState.filters.memberId,
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
          dataIndex: ['due', 'date'],
          render: (dueDate: string) => new DateUtcVo(dueDate).format(),
          title: 'Fecha',
          width: 150,
        },
        {
          align: 'center',
          dataIndex: ['due', 'category'],
          render: (category: DueCategoryEnum, paymentDue) => {
            invariant(paymentDue.due);

            if (category === DueCategoryEnum.MEMBERSHIP) {
              return `${DueCategoryLabel[category]} (${new DateUtcVo(paymentDue.due.date).monthName()})`;
            }

            return DueCategoryLabel[category];
          },
          title: 'Categoría',
        },
        {
          align: 'right',
          dataIndex: ['due', 'amount'],
          render: (amount) => new Money({ amount }).formatWithCurrency(),
          title: 'Deuda',
        },
        {
          align: 'right',
          dataIndex: 'amount',
          render: (amount) => new Money({ amount }).formatWithCurrency(),
          title: 'Monto Registrado',
        },
      ]}
      dataSource={payment.paymentDues}
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
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />

            {SecurityUtils.isInRole(
              PermissionEnum.CREATE,
              ScopeEnum.PAYMENTS,
            ) && <GridNewButton to={AppUrl.PaymentsNew} />}
          </>
        }
      >
        <Grid<PaymentGridDto>
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
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
              defaultFilteredValue: undefined,
              filterResetToDefaultFilteredValue: true,
              filterSearch: true,
              filteredValue: gridState.filters.memberId,
              filters: GridUtils.getMembersForFilter(members),
              render: (_, payment: PaymentGridDto) => payment.member.name,
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
                  {SecurityUtils.isInRole(
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

                  <GridFilterByMemberButton
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
