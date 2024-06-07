import { InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Space, Tooltip } from 'antd';
import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid.request.dto';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusEnum,
  DueStatusLabel,
  getDueStatusColumnFilters,
} from '@domain/dues/due.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { DuePaymentsGrid } from '@ui/components/Dues/DuePaymentsGrid';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const DuesPage = () => {
  const {
    state: gridState,
    onTableChange,
    setState,
  } = useTable<DueGridDto>({
    defaultFilters: {
      memberId: [],
      status: [
        DueStatusEnum.PAID,
        DueStatusEnum.PARTIALLY_PAID,
        DueStatusEnum.PENDING,
      ],
    },
    defaultSorter: { date: 'descend' },
  });

  const navigate = useNavigate();

  const { data: members } = useMembers({});

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetDuesGridRequestDto,
    DueGridDto
  >({
    methodName: MeteorMethodEnum.DuesGetGrid,
    request: {
      filterByMember: gridState.filters.memberId,
      filterByStatus: gridState.filters.status as DueStatusEnum[],
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const expandedRowRender = (due: DueGridDto) => (
    <DuePaymentsGrid payments={due.payments} />
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Cobros' }]}
      />

      <Card
        title="Cobros"
        extra={
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
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
          expandable={{ expandedRowRender }}
          columns={[
            {
              dataIndex: 'date',
              render: (date: string, due: DueGridDto) => (
                <Link to={`${AppUrl.Dues}/${due.id}`}>
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
              filterSearch: true,
              filteredValue: gridState.filters.memberId,
              filters: GridUtils.getMembersForFilter(members),
              render: (_, payment: DueGridDto) => payment.member?.name,
              sortOrder: gridState.sorter.memberId,
              sorter: true,
              title: 'Socio',
            },
            {
              align: 'center',
              dataIndex: 'category',
              render: (category: DueCategoryEnum) => DueCategoryLabel[category],
              title: 'Categoría',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'amount',
              render: (amount: number) =>
                new Money({ amount }).formatWithCurrency(),
              title: 'Monto',
              width: 100,
            },
            {
              align: 'right',
              dataIndex: 'totalPendingAmount',
              render: (totalPendingAmount: number, due: DueGridDto) => {
                const pendingAmountFormatted = new Money({
                  amount: totalPendingAmount,
                }).formatWithCurrency();

                if (
                  totalPendingAmount === due.amount ||
                  totalPendingAmount === 0
                ) {
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
              filterResetToDefaultFilteredValue: true,
              filteredValue: gridState.filters.status,
              filters: getDueStatusColumnFilters(),
              render: (status: DueStatusEnum) => DueStatusLabel[status],
              title: 'Estado',
              width: 150,
            },
            {
              align: 'center',
              render: (_, due: DueGridDto) => (
                <Space.Compact size="small">
                  <GridFilterByMemberButton
                    gridState={gridState}
                    setState={setState}
                    memberId={due.memberId}
                  />

                  {SecurityUtils.isInRole(
                    PermissionEnum.CREATE,
                    ScopeEnum.PAYMENTS,
                  ) && (
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
                      disabled={due.status === DueStatusEnum.PAID}
                      tooltip={{ title: 'Cobrar' }}
                      icon={<FaCreditCard />}
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
