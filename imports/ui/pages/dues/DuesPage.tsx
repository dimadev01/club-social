import { Card, Space, Typography } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  DueCategoryEnum,
  DueStatusEnum,
  DueStatusLabel,
} from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl, AppUrlGenericEnum } from '@ui/app.enum';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { Button } from '@ui/components/Button/Button';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';
import { DueCategoryIconWithLabel } from '@ui/components/Dues/DueCategoryLabel';
import { DuePaymentsGrid } from '@ui/components/Dues/DuePaymentsGrid';
import { DuesUIUtils } from '@ui/components/Dues/Dues.utils';
import { DuesGridCsvDownloaderButton } from '@ui/components/Dues/DuesGridCsvDownloader';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useGrid } from '@ui/components/Grid/useGrid';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { PaymentsIcon } from '@ui/components/Icons/PaymentsIcon';
import { UserIcon } from '@ui/components/Icons/UserIcon';
import { GetDuesGridRequestDto } from '@ui/dtos/get-dues-grid-request.dto';
import { GetDuesTotalsRequestDto } from '@ui/dtos/get-dues-totals-request.dto';
import { usePermissions } from '@ui/hooks/auth/usePermissions';
import { useDuesTotals } from '@ui/hooks/dues/useDuesTotals';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';
import { useUserContext } from '@ui/providers/UserContext';

export const DuesPage = () => {
  const { member } = useUserContext();

  const permissions = usePermissions();

  const presets = useMemo(() => getPresets(), []);

  const {
    gridState,
    onTableChange,
    setGridState: setState,
    clearFilters,
    resetFilters,
  } = useGrid<DueGridDto>({
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

  const gridRequestFilters: GetDuesTotalsRequestDto = {
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
          <Link to={due.id} state={gridState}>
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
        title: 'Fecha de deuda',
        width: 100,
      },
    );

    if (permissions.isAdmin || permissions.isStaff) {
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
        filters: DuesUIUtils.getCategoryGridFilters(),
        render: (category: DueCategoryEnum, due) => (
          <DueCategoryIconWithLabel category={category} date={due.date} />
        ),
        title: 'Categoría',
        width: 100,
      },
      {
        align: 'right',
        dataIndex: 'amount',
        ellipsis: true,
        render: (amount: number) => new Money({ amount }).formatWithCurrency(),
        title: 'Monto Original',
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
        render: (totalPendingAmount: number) =>
          new Money({ amount: totalPendingAmount }).formatWithCurrency(),
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
        filterMode: 'tree',
        filterResetToDefaultFilteredValue: true,
        filteredValue: gridState.filters.status,
        filters: DuesUIUtils.getStatusGridFilters(),
        render: (status: DueStatusEnum) => DueStatusLabel[status],
        title: 'Estado',
        width: 125,
      },
    );

    if (permissions.isAdmin || permissions.isStaff) {
      columns.push({
        align: 'center',
        render: (_, due: DueGridDto) => (
          <Space.Compact size="small">
            <GridFilterByMemberButton
              gridState={gridState}
              setState={setState}
              memberId={due.memberId}
            />

            {permissions.payments.create && (
              <Button
                type="text"
                onClick={() => {
                  navigate(
                    `/${AppUrl.PAYMENTS}/${AppUrlGenericEnum.NEW}${UrlUtils.stringify(
                      {
                        dueIds: [due.id],
                        memberId: due.memberId,
                      },
                    )}`,
                  );
                }}
                htmlType="button"
                disabled={!due.isPayable}
                tooltip={{ title: 'Cobrar' }}
                icon={<PaymentsIcon />}
              />
            )}

            {permissions.member.read && (
              <Button
                type="text"
                onClick={() => {
                  navigate(
                    `/${AppUrl.MEMBERS}${UrlUtils.stringify({
                      filters: { id: [due.memberId] },
                    })}`,
                  );
                }}
                htmlType="button"
                tooltip={{ title: 'Ver Socio' }}
                icon={<UserIcon />}
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

    if (permissions.isMember) {
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
                amount: duesTotals?.total ?? 0,
              }).formatWithCurrency()}
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={restColSpan} />
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <Card
      title={
        <Space>
          <DuesIcon />
          <span>Deudas</span>
        </Space>
      }
      extra={
        <Space.Compact>
          <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
          <DuesGridCsvDownloaderButton request={gridRequest} />
          <GridNewButton scope={ScopeEnum.DUES} />
        </Space.Compact>
      }
    >
      <Grid<DueGridDto>
        total={data?.totalCount}
        state={gridState}
        onTableChange={onTableChange}
        clearFilters={clearFilters}
        resetFilters={resetFilters}
        loading={isLoading}
        dataSource={data?.items}
        expandable={{ expandedRowRender }}
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
  );
};
