import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Space, Tooltip } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
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
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridFilterByMemberButton } from '@ui/components/Grid/GridFilterByMemberButton';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useDeleteDue } from '@ui/hooks/dues/useDeleteDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useNotificationSuccess } from '@ui/hooks/useNotification';
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
      status: [DueStatusEnum.PENDING, DueStatusEnum.PARTIALLY_PAID],
    },
    defaultSorter: { date: 'descend' },
  });

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

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

  const deleteDue = useDeleteDue();

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Cobros' }]}
      />

      <Card
        title="Cobros"
        extra={
          <>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />

            {SecurityUtils.isInRole(PermissionEnum.CREATE, ScopeEnum.DUES) && (
              <GridNewButton to={AppUrl.DuesNew} />
            )}
          </>
        }
      >
        <Grid<DueGridDto>
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
          columns={[
            {
              dataIndex: 'date',
              render: (date: string, due: DueGridDto) => (
                <Link to={`${AppUrl.Dues}/${due.id}`}>
                  {new DateUtcVo(date).format()}
                </Link>
              ),
              title: 'Fecha',
              width: 125,
            },
            {
              dataIndex: 'memberId',
              filterSearch: true,
              filteredValue: gridState.filters.memberId,
              filters: GridUtils.getMembersForFilter(members),
              render: (_, payment: DueGridDto) => payment.member?.name,
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
              dataIndex: 'pendingAmount',
              render: (pendingAmount: number, due: DueGridDto) => {
                const pendingAmountFormatted = new Money({
                  amount: pendingAmount,
                }).formatWithCurrency();

                if (pendingAmount === due.amount) {
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
              defaultFilteredValue: [DueStatusEnum.PENDING],
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
                <ButtonGroup size="small">
                  {SecurityUtils.isInRole(
                    PermissionEnum.DELETE,
                    ScopeEnum.DUES,
                  ) && (
                    <Button
                      popConfirm={{
                        onConfirm: () =>
                          deleteDue.mutate(
                            { id: due.id },
                            {
                              onError: () => deleteDue.reset(),
                              onSuccess: () => {
                                deleteDue.reset();

                                notificationSuccess('Cobro eliminado');

                                refetch();
                              },
                            },
                          ),
                        title: '¿Está seguro de eliminar este cobro?',
                      }}
                      type="text"
                      htmlType="button"
                      tooltip={{ title: 'Eliminar' }}
                      icon={<DeleteOutlined />}
                      loading={deleteDue.variables?.id === due.id}
                      disabled={
                        deleteDue.variables?.id === due.id ||
                        due.status !== DueStatusEnum.PENDING
                      }
                    />
                  )}

                  <GridFilterByMemberButton
                    gridState={gridState}
                    setState={setState}
                    memberId={due.memberId}
                  />

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
                </ButtonGroup>
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
