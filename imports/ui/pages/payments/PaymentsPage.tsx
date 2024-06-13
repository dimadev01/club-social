import { CreditCardOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { GetPaymentsTotalsRequestDto } from '@adapters/dtos/get-payments-totals-request.dto';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  PaymentStatusEnum,
  PaymentStatusLabel,
  getPaymentStatusColumnFilters,
} from '@domain/payments/payment.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { PaymentDuesGrid } from '@ui/components/Payments/PaymentDuesGrid';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsMember } from '@ui/hooks/auth/useIsMember';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';
import { useMembers } from '@ui/hooks/members/useMembers';
import { usePaymentsTotals } from '@ui/hooks/payments/usePaymentsTotals';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';
import { useUserContext } from '@ui/providers/UserContext';

export const PaymentsPage = () => {
  const isStaff = useIsStaff();

  const isAdmin = useIsAdmin();

  const isMember = useIsMember();

  const { member } = useUserContext();

  const { gridState, onTableChange, setGridState } = useTable<PaymentGridDto>({
    defaultFilters: {
      createdAt: [],
      date: [],
      memberId: [],
      status: [PaymentStatusEnum.PAID],
    },
    defaultSorter: { createdAt: 'descend' },
  });

  const { data: members } = useMembers();

  if (member) {
    gridState.filters.memberId = [member._id];
  }

  const gridRequestFilters: GetPaymentsTotalsRequestDto = {
    filterByCreatedAt: gridState.filters.createdAt,
    filterByDate: gridState.filters.date,
    filterByMember: gridState.filters.memberId,
    filterByStatus: gridState.filters.status as PaymentStatusEnum[],
  };

  const { data, isLoading, refetch, isRefetching } = useQueryGrid<
    GetPaymentsGridRequestDto,
    PaymentGridDto
  >({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      ...gridRequestFilters,
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const { data: paymentTotals } = usePaymentsTotals(gridRequestFilters);

  const expandedRowRender = (payment: PaymentGridDto) => (
    <PaymentDuesGrid dues={payment.dues} />
  );

  const renderCreatedAtFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Creación"
      value={gridState.filters.createdAt}
      props={props}
    />
  );

  const renderDateFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Pago"
      value={gridState.filters.date}
      props={props}
    />
  );

  const getColumns = (): ColumnProps<PaymentGridDto>[] => {
    const columns: ColumnProps<PaymentGridDto>[] = [];

    columns.push(
      {
        dataIndex: 'createdAt',
        ellipsis: true,
        filterDropdown: renderCreatedAtFilter,
        filteredValue: gridState.filters.createdAt,
        render: (createdAt: string, payment: PaymentGridDto) => (
          <Link to={`${AppUrl.PAYMENTS}/${payment.id}`}>
            {new DateVo(createdAt).format(DateFormatEnum.DDMMYYHHmm)}
          </Link>
        ),
        sortOrder: gridState.sorter.createdAt,
        sorter: true,
        title: 'Fecha de creación',
        width: 150,
      },
      {
        dataIndex: 'date',
        ellipsis: true,
        filterDropdown: renderDateFilter,
        filteredValue: gridState.filters.date,
        render: (date: string) => new DateUtcVo(date).format(),
        title: 'Fecha de pago',
        width: 100,
      },
    );

    if (isAdmin || isStaff) {
      columns.push({
        dataIndex: 'memberId',
        defaultFilteredValue: undefined,
        ellipsis: true,
        filterResetToDefaultFilteredValue: true,
        filterSearch: true,
        filteredValue: gridState.filters.memberId,
        filters: GridUtils.getMembersForFilter(members),
        render: (_, payment: PaymentGridDto) => payment.member.name,
        title: 'Socio',
        width: 200,
      });
    }

    columns.push(
      {
        align: 'right',
        dataIndex: 'duesCount',
        ellipsis: true,
        title: '#',
        width: 50,
      },
      {
        align: 'right',
        dataIndex: 'amount',
        ellipsis: true,
        render: (amount: number) => new Money({ amount }).formatWithCurrency(),
        title: 'Total',
        width: 100,
      },
      {
        align: 'right',
        dataIndex: 'receiptNumber',
        ellipsis: true,
        title: 'Recibo #',
        width: 100,
      },
      {
        align: 'center',
        dataIndex: 'status',
        defaultFilteredValue: [PaymentStatusEnum.PAID],
        ellipsis: true,
        filterResetToDefaultFilteredValue: true,
        filteredValue: gridState.filters.status,
        filters: getPaymentStatusColumnFilters(),
        render: (status: PaymentStatusEnum) => PaymentStatusLabel[status],
        title: 'Estado',
        width: 100,
      },
    );

    if (isAdmin || isStaff) {
      columns.push({
        align: 'center',
        ellipsis: true,
        render: (_, payment: PaymentGridDto) => (
          <Space.Compact size="small">
            <GridFilterByMemberButton
              gridState={gridState}
              setState={setGridState}
              memberId={payment.memberId}
            />
          </Space.Compact>
        ),
        title: 'Acciones',
        width: 75,
      });
    }

    return columns;
  };

  const renderSummary = () => {
    let totalAmountColSpan = 6;

    let restColSpan = 4;

    if (isMember) {
      totalAmountColSpan = 5;

      restColSpan = 3;
    }

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell
            align="right"
            index={0}
            colSpan={totalAmountColSpan}
          >
            <Typography.Text strong>
              Total:{' '}
              {new Money({
                amount: paymentTotals?.total ?? 0,
              }).formatWithCurrency()}
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={restColSpan} />
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Pagos' }]}
      />

      <Card
        title={
          <Space>
            <CreditCardOutlined />
            <span>Pagos</span>
          </Space>
        }
        extra={
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <GridNewButton
              scope={ScopeEnum.PAYMENTS}
              to={AppUrl.PAYMENTS_NEW}
            />
          </Space.Compact>
        }
      >
        <Grid<PaymentGridDto>
          total={data?.totalCount}
          state={gridState}
          summary={renderSummary}
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
