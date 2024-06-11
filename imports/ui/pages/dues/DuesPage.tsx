import {
  CreditCardOutlined,
  InfoCircleOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid-request.dto';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  DueCategoryEnum,
  DueStatusEnum,
  DueStatusLabel,
  getDueCategoryFilters,
  getDueStatusColumnFilters,
} from '@domain/dues/due.enum';
import { FindPaginatedDuesFilters } from '@domain/dues/due.repository';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { DuePaymentsGrid } from '@ui/components/Dues/DuePaymentsGrid';
import { DuesGridCsvDownloaderButton } from '@ui/components/Dues/DuesGridCsvDownloader';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';
import { useIsMember } from '@ui/hooks/auth/useIsMember';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';
import { useDuesTotals } from '@ui/hooks/dues/useDuesTotals';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';
import { useUserContext } from '@ui/providers/UserContext';
import { renderDueCategoryLabel } from '@ui/utils/renderDueCategory';

export const DuesPage = () => {
  const isStaff = useIsStaff();

  const isAdmin = useIsAdmin();

  const isMember = useIsMember();

  const { member } = useUserContext();

  const canCreatePayments = useIsInRole(
    PermissionEnum.CREATE,
    ScopeEnum.PAYMENTS,
  );

  const {
    gridState,
    onTableChange,
    setGridState: setState,
  } = useTable<DueGridDto>({
    defaultFilters: {
      category: [],
      createdAt: [],
      date: [],
      memberId: [],
      status: [
        DueStatusEnum.PAID,
        DueStatusEnum.PARTIALLY_PAID,
        DueStatusEnum.PENDING,
      ],
    },
    defaultSorter: { createdAt: 'descend' },
  });

  const navigate = useNavigate();

  const { data: members } = useMembers();

  if (member) {
    gridState.filters.memberId = [member._id];
  }

  const gridRequestFilters: FindPaginatedDuesFilters = {
    filterByCategory: gridState.filters.category as DueCategoryEnum[],
    filterByCreatedAt: gridState.filters.createdAt,
    filterByDate: gridState.filters.date,
    filterByMember: gridState.filters.memberId,
    filterByStatus: gridState.filters.status as DueStatusEnum[],
  };

  const gridRequest: GetDuesGridRequestDto = {
    ...gridRequestFilters,
    limit: gridState.pageSize,
    page: gridState.page,
    sorter: gridState.sorter,
  };

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetDuesGridRequestDto,
    DueGridDto
  >({
    methodName: MeteorMethodEnum.DuesGetGrid,
    request: gridRequest,
  });

  const { data: duesTotals } = useDuesTotals(gridRequestFilters);

  const expandedRowRender = (due: DueGridDto) => (
    <DuePaymentsGrid payments={due.payments} />
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
      title="Filtrar por Fecha de Deuda"
      value={gridState.filters.date}
      props={props}
    />
  );

  const getColumns = (): ColumnProps<DueGridDto>[] => {
    const columns: ColumnProps<DueGridDto>[] = [];

    columns.push(
      {
        dataIndex: 'createdAt',
        ellipsis: true,
        filterDropdown: renderCreatedAtFilter,
        filteredValue: gridState.filters.createdAt,
        render: (createdAt: string, due: DueGridDto) => (
          <Link to={`${AppUrl.Dues}/${due.id}`}>
            {new DateVo(createdAt).format(DateFormatEnum.DDMMYYHHmm)}
          </Link>
        ),
        sortOrder: gridState.sorter.createdAt,
        sorter: true,
        title: 'Fecha de creación',
        width: 125,
      },
      {
        dataIndex: 'date',
        ellipsis: true,
        filterDropdown: renderDateFilter,
        filteredValue: gridState.filters.date,
        render: (date: string) => new DateUtcVo(date).format(),
        title: 'Fecha de deuda',
        width: 100,
      },
    );

    if (isAdmin || isStaff) {
      columns.push({
        dataIndex: 'memberId',
        ellipsis: true,
        filterSearch: true,
        filteredValue: gridState.filters.memberId,
        filters: GridUtils.getMembersForFilter(members),
        render: (_, payment: DueGridDto) => payment.member?.name,
        title: 'Socio',
        width: 200,
      });
    }

    columns.push(
      {
        align: 'center',
        dataIndex: 'category',
        ellipsis: true,
        filteredValue: gridState.filters.category,
        filters: getDueCategoryFilters(),
        render: (category: DueCategoryEnum, due) =>
          renderDueCategoryLabel(category, due.date),
        title: 'Categoría',
        width: 100,
      },
      {
        align: 'right',
        dataIndex: 'amount',
        ellipsis: true,
        render: (amount: number) => new Money({ amount }).formatWithCurrency(),
        title: 'Monto inicial',
        width: 100,
      },
      {
        align: 'right',
        dataIndex: 'totalPaidAmount',
        ellipsis: true,
        render: (totalPaidAmount: number) =>
          new Money({ amount: totalPaidAmount }).formatWithCurrency(),
        title: 'Monto pago',
        width: 100,
      },
      {
        align: 'right',
        dataIndex: 'totalPendingAmount',
        ellipsis: true,
        render: (totalPendingAmount: number, due: DueGridDto) => {
          const pendingAmountFormatted = new Money({
            amount: totalPendingAmount,
          }).formatWithCurrency();

          if (totalPendingAmount === due.amount || totalPendingAmount === 0) {
            return pendingAmountFormatted;
          }

          const amountFormatted = new Money({
            amount: due.amount,
          }).formatWithCurrency();

          return (
            <Space>
              <Tooltip title={`Importe original: ${amountFormatted}`}>
                <InfoCircleOutlined />
              </Tooltip>
              {pendingAmountFormatted}
            </Space>
          );
        },
        title: 'Pendiente',
        width: 100,
      },
      {
        align: 'center',
        dataIndex: 'status',
        defaultFilteredValue: [
          DueStatusEnum.PAID,
          DueStatusEnum.PARTIALLY_PAID,
          DueStatusEnum.PENDING,
        ],
        ellipsis: true,
        filterResetToDefaultFilteredValue: true,
        filteredValue: gridState.filters.status,
        filters: getDueStatusColumnFilters(),
        render: (status: DueStatusEnum) => DueStatusLabel[status],
        title: 'Estado',
        width: 125,
      },
    );

    if (isAdmin || isStaff) {
      columns.push({
        align: 'center',
        render: (_, due: DueGridDto) => (
          <Space.Compact size="small">
            <GridFilterByMemberButton
              gridState={gridState}
              setState={setState}
              memberId={due.memberId}
            />

            {canCreatePayments && (
              <Button
                type="text"
                onClick={() => {
                  navigate(
                    UrlUtils.navigate(AppUrl.PaymentsNew, {
                      dueIds: [due.id],
                      memberId: due.memberId,
                    }),
                  );
                }}
                htmlType="button"
                disabled={
                  due.status === DueStatusEnum.PAID ||
                  due.status === DueStatusEnum.VOIDED
                }
                tooltip={{ title: 'Cobrar' }}
                icon={<CreditCardOutlined />}
              />
            )}
          </Space.Compact>
        ),
        title: 'Acciones',
        width: 100,
      });
    }

    return columns;
  };

  const renderSummary = () => {
    let totalPendingColSpan = 8;

    let restColSpan = 2;

    if (isMember) {
      totalPendingColSpan = 7;

      restColSpan = 1;
    }

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell
            align="right"
            index={0}
            colSpan={totalPendingColSpan}
          >
            <Typography.Text strong>
              Total Pendiente:{' '}
              {new Money({
                amount: duesTotals?.pendingAmount ?? 0,
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
        items={[{ title: 'Inicio' }, { title: 'Cobros' }]}
      />

      <Card
        title={
          <Space>
            <WalletOutlined />
            <span>Cobros</span>
          </Space>
        }
        extra={
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <DuesGridCsvDownloaderButton request={gridRequest} />
            <GridNewButton scope={ScopeEnum.DUES} to={AppUrl.DuesNew} />
          </Space.Compact>
        }
      >
        <Grid<DueGridDto>
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
          expandable={{
            expandedRowRender,
          }}
          summary={renderSummary}
          columns={getColumns()}
          rowClassName={(due) => {
            if (due.status === DueStatusEnum.PENDING) {
              return 'bg-blue-100 dark:bg-blue-900';
            }

            if (due.status === DueStatusEnum.PAID) {
              return 'bg-green-100 dark:bg-green-900';
            }

            if (due.status === DueStatusEnum.PARTIALLY_PAID) {
              return 'bg-yellow-100 dark:bg-yellow-900';
            }

            if (due.status === DueStatusEnum.VOIDED) {
              return 'bg-gray-100 dark:bg-gray-900';
            }

            throw new Error('Unknown movement type');
          }}
        />
      </Card>
    </>
  );
};
