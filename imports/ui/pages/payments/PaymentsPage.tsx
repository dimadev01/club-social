import { Breadcrumb, Card, Space } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  PaymentStatusEnum,
  PaymentStatusLabel,
  getPaymentStatusColumnFilters,
} from '@domain/payments/payment.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { PaymentDuesGrid } from '@ui/components/Payments/PaymentDuesGrid';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { useUserContext } from '@ui/providers/UserContext';

export const PaymentsPage = () => {
  const isStaff = useIsStaff();

  const isAdmin = useIsAdmin();

  const { member } = useUserContext();

  const {
    state: gridState,
    onTableChange,
    setState,
  } = useTable<PaymentGridDto>({
    defaultFilters: { memberId: [], status: [PaymentStatusEnum.PAID] },
    defaultSorter: { date: 'descend' },
  });

  const { data: members } = useMembers();

  if (member) {
    gridState.filters.memberId = [member._id];
  }

  const { data, isLoading, refetch, isRefetching } = useQueryGrid<
    GetPaymentsGridRequestDto,
    PaymentGridDto
  >({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      filterByMember: gridState.filters.memberId,
      filterByStatus: gridState.filters.status as PaymentStatusEnum[],
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const expandedRowRender = (payment: PaymentGridDto) => (
    <PaymentDuesGrid dues={payment.dues} />
  );

  const getColumns = (): ColumnProps<PaymentGridDto>[] => {
    const columns: ColumnProps<PaymentGridDto>[] = [];

    columns.push({
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
    });

    if (isAdmin || isStaff) {
      columns.push({
        dataIndex: 'memberId',
        defaultFilteredValue: undefined,
        filterResetToDefaultFilteredValue: true,
        filterSearch: true,
        filteredValue: gridState.filters.memberId,
        filters: GridUtils.getMembersForFilter(members),
        render: (_, payment: PaymentGridDto) => payment.member.name,
        title: 'Socio',
      });
    }

    columns.push(
      {
        align: 'right',
        dataIndex: 'duesCount',
        title: '#',
        width: 50,
      },
      {
        align: 'right',
        dataIndex: 'amount',
        render: (amount: number) => new Money({ amount }).formatWithCurrency(),
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
        dataIndex: 'status',
        filterResetToDefaultFilteredValue: true,
        filteredValue: gridState.filters.status,
        filters: getPaymentStatusColumnFilters(),
        render: (status: PaymentStatusEnum) => PaymentStatusLabel[status],
        title: 'Estado',
        width: 150,
      },
    );

    if (isAdmin || isStaff) {
      columns.push({
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
      });
    }

    return columns;
  };

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
          columns={getColumns()}
        />
      </Card>
    </>
  );
};
