import { CreditCardFilled } from '@ant-design/icons';
import {
  Breadcrumb,
  Card,
  DatePicker,
  Flex,
  Form,
  Space,
  Spin,
  Typography,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Dayjs } from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
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
import { Button } from '@ui/components/Button';
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
import { usePaymentsTotals } from '@ui/hooks/payments/usePaymentsTotals';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { useUserContext } from '@ui/providers/UserContext';

type FilterByCreatedAtFormValues = {
  period: [Dayjs, Dayjs];
};

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
    defaultSorter: { createdAt: 'descend' },
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
      filterByPeriod: ['', ''],
      filterByStatus: gridState.filters.status as PaymentStatusEnum[],
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const { data: paymentTotals, isLoading: isLoadingPaymentTotals } =
    usePaymentsTotals({
      filterByMember: gridState.filters.memberId,
      filterByStatus: gridState.filters.status as PaymentStatusEnum[],
    });

  const expandedRowRender = (payment: PaymentGridDto) => (
    <PaymentDuesGrid dues={payment.dues} />
  );

  const renderCreatedAtFilter = () => (
    <Form<FilterByCreatedAtFormValues>
      onFinish={(value) => {
        console.log(value);
      }}
      requiredMark={false}
      layout="vertical"
      className="p-4"
    >
      <Form.Item name="period" label="Filtrar por fecha">
        <DatePicker.RangePicker />
      </Form.Item>

      <Flex justify="space-between">
        <Button size="small">Cancelar</Button>
        <Button htmlType="submit" size="small" type="primary">
          Confirmar
        </Button>
      </Flex>
    </Form>
  );

  const getColumns = (): ColumnProps<PaymentGridDto>[] => {
    const columns: ColumnProps<PaymentGridDto>[] = [];

    columns.push(
      {
        dataIndex: 'createdAt',
        // filterDropdown: () => renderCreatedAtFilter(),
        render: (createdAt: string, payment: PaymentGridDto) => (
          <Link to={`${AppUrl.Payments}/${payment.id}`}>
            {new DateVo(createdAt).format(DateFormatEnum.DDMMYYHHmm)}
          </Link>
        ),
        sortOrder: gridState.sorter.createdAt,
        sorter: true,
        title: 'Fecha de creación',
        width: 200,
      },
      {
        dataIndex: 'date',
        render: (date: string) => new DateUtcVo(date).format(),
        title: 'Fecha de pago',
      },
    );

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
        defaultFilteredValue: [PaymentStatusEnum.PAID],
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
        title={
          <Space>
            <CreditCardFilled />
            <span>Pagos</span>
          </Space>
        }
        extra={
          <Space>
            {isLoadingPaymentTotals && <Spin spinning />}

            {paymentTotals && (
              <Typography.Text className="self-center">
                Total:{' '}
                {new Money({
                  amount: paymentTotals.amount,
                }).formatWithCurrency()}
              </Typography.Text>
            )}

            <Space.Compact>
              <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
              <GridNewButton
                scope={ScopeEnum.PAYMENTS}
                to={AppUrl.PaymentsNew}
              />
            </Space.Compact>
          </Space>
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
