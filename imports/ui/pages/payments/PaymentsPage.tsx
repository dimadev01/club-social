import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { PaymentDuesGrid } from '@ui/components/Payments/PaymentDuesGrid';
import { useMembers } from '@ui/hooks/members/useMembers';
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
    GetPaymentsGridRequestDto,
    PaymentGridDto
  >({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      filterByMember: gridState.filters.memberId,
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const expandedRowRender = (payment: PaymentGridDto) => (
    <PaymentDuesGrid dues={payment.dues} />
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
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <GridNewButton scope={ScopeEnum.PAYMENTS} to={AppUrl.PaymentsNew} />
          </Space.Compact>
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
              sortOrder: gridState.sorter.date,
              sorter: true,
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
              dataIndex: 'duesCount',
              title: '#',
              width: 50,
            },
            {
              align: 'right',
              dataIndex: 'amount',
              render: (amount: number) =>
                new Money({ amount }).formatWithCurrency(),
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
