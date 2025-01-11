import { Card, Space, Table, Typography } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  MovementCategoryEnum,
  MovementCategoryLabel,
  MovementStatusEnum,
  MovementStatusLabel,
  MovementTypeEnum,
  MovementTypeLabel,
  getCategoryFilters,
  getMovementStatusColumnFilters,
  getMovementTypeOptions,
} from '@domain/categories/category.enum';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { Button } from '@ui/components/Button/Button';
import { Grid } from '@ui/components/Grid/Grid';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useGrid } from '@ui/components/Grid/useGrid';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { MovementsIcon } from '@ui/components/Icons/MovementsIcon';
import { PaymentsIcon } from '@ui/components/Icons/PaymentsIcon';
import { UserIcon } from '@ui/components/Icons/UserIcon';
import { ViewIcon } from '@ui/components/Icons/ViewIcon';
import { MovementsGridCsvDownloaderButton } from '@ui/components/Movements/MovementsGridCsvDownloader';
import { GetMovementsGridRequestDto } from '@ui/dtos/get-movements-grid-request.dto';
import { GetMovementsTotalsRequestDto } from '@ui/dtos/get-movements-totals-request.dto';
import { usePermissions } from '@ui/hooks/auth/usePermissions';
import { useMovementsTotals } from '@ui/hooks/movements/useMovementsTotals';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';

export const MovementsPage = () => {
  const navigate = useNavigate();

  const permissions = usePermissions();

  const { gridState, onTableChange, clearFilters, resetFilters } =
    useGrid<MovementGridDto>({
      defaultFilters: {
        category: [],
        createdAt: [],
        date: [],
        status: [MovementStatusEnum.REGISTERED],
        type: [],
      },
      defaultSorter: { createdAt: 'descend' },
    });

  const gridRequestFilters: GetMovementsTotalsRequestDto = {
    filterByCategory: gridState.filters.category as MovementCategoryEnum[],
    filterByCreatedAt: gridState.filters.createdAt,
    filterByDate: gridState.filters.date,
    filterByStatus: gridState.filters.status as MovementStatusEnum[],
    filterByType: gridState.filters.type as MovementTypeEnum[],
  };

  const gridRequest: GetMovementsGridRequestDto = {
    ...gridRequestFilters,
    limit: gridState.pageSize,
    page: gridState.page,
    sorter: gridState.sorter,
  };

  const { data, isFetching, isRefetching, refetch } = useQueryGrid<
    GetMovementsGridRequestDto,
    MovementGridDto
  >({
    methodName: MeteorMethodEnum.MovementsGetGrid,
    request: gridRequest,
  });

  const { data: movementsTotals } = useMovementsTotals(gridRequestFilters);

  const renderCreatedAtFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Creación"
      value={gridState.filters.createdAt}
      props={props}
    />
  );

  const renderDateFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Movimiento"
      value={gridState.filters.date}
      props={props}
    />
  );

  const renderSummary = () => (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell align="right" index={0} colSpan={5}>
          <Typography.Text strong>
            Total:{' '}
            {Money.from({
              amount: movementsTotals?.total ?? 0,
            }).formatWithCurrency()}
          </Typography.Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} colSpan={3} />
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <Card
      title={
        <Space>
          <MovementsIcon />
          <span>Movimientos</span>
        </Space>
      }
      extra={
        <Space.Compact>
          <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
          <MovementsGridCsvDownloaderButton request={gridRequest} />
          <GridNewButton scope={ScopeEnum.MOVEMENTS} />
        </Space.Compact>
      }
    >
      <Grid<MovementGridDto>
        summary={renderSummary}
        clearFilters={clearFilters}
        resetFilters={resetFilters}
        total={data?.totalCount}
        state={gridState}
        onTableChange={onTableChange}
        loading={isFetching}
        dataSource={data?.items}
        rowClassName={(movement) => {
          if (movement.isVoided) {
            return 'bg-gray-100 dark:bg-gray-900';
          }

          if (movement.isExpense) {
            return 'bg-red-100 dark:bg-red-900';
          }

          if (movement.isIncome) {
            return 'bg-green-100 dark:bg-green-900';
          }

          throw new Error('Unknown movement type');
        }}
        columns={[
          {
            dataIndex: 'createdAt',
            ellipsis: true,
            filterDropdown: renderCreatedAtFilter,
            filteredValue: gridState.filters.createdAt,
            render: (date: string, movement: MovementGridDto) => (
              <Link to={movement.id} state={gridState}>
                {new DateTimeVo(date).format(DateFormatEnum.DDMMYYHHmm)}
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
            render: (date: string) => new DateVo(date).format(),
            title: 'Fecha de movimiento',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'type',
            ellipsis: true,
            filteredValue: gridState.filters.type,
            filters: getMovementTypeOptions(),
            render: (type: MovementTypeEnum) => MovementTypeLabel[type],
            title: 'Tipo',
            width: 75,
          },
          {
            align: 'center',
            dataIndex: 'category',
            ellipsis: true,
            filterMode: 'tree',
            filteredValue: gridState.filters.category,
            filters: getCategoryFilters(),
            render: (category: MovementCategoryEnum) =>
              MovementCategoryLabel[category],
            title: 'Categoría',
            width: 125,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            ellipsis: true,
            render: (amount) => Money.from({ amount }).formatWithCurrency(),
            title: 'Importe',
            width: 75,
          },
          {
            dataIndex: 'paymentMemberName',
            ellipsis: true,
            title: 'Socio',
            width: 125,
          },
          {
            align: 'center',
            dataIndex: 'status',
            defaultFilteredValue: [MovementStatusEnum.REGISTERED],
            ellipsis: true,
            filterResetToDefaultFilteredValue: true,
            filteredValue: gridState.filters.status,
            filters: getMovementStatusColumnFilters(),
            render: (status: MovementStatusEnum) => MovementStatusLabel[status],
            title: 'Estado',
            width: 100,
          },
          {
            dataIndex: 'notes',
            render: (notes: string) => (
              <Typography.Paragraph
                className="!mb-0"
                ellipsis={{ expandable: true }}
              >
                {notes}
              </Typography.Paragraph>
            ),
            title: 'Notas',
            width: 150,
          },
          {
            align: 'center',
            ellipsis: true,
            render: (_, movement: MovementGridDto) => {
              if (!movement.paymentId) {
                return null;
              }

              invariant(movement.paymentMemberId);

              invariant(movement.paymentMemberName);

              return (
                movement.paymentId && (
                  <Space.Compact size="small">
                    {permissions.payments.read && (
                      <Button
                        type="text"
                        onClick={() => {
                          navigate(
                            `/${AppUrl.PAYMENTS}/${movement.paymentId}`,
                            { state: gridState },
                          );
                        }}
                        htmlType="button"
                        tooltip={{ title: 'Ver Detalle del Pago' }}
                        icon={<ViewIcon />}
                      />
                    )}

                    {permissions.dues.read && (
                      <Button
                        type="text"
                        onClick={() => {
                          navigate(
                            `/${AppUrl.DUES}${UrlUtils.stringify({
                              filters: {
                                memberId: [movement.paymentMemberId],
                              },
                            })}`,
                            { state: gridState },
                          );
                        }}
                        htmlType="button"
                        tooltip={{ title: 'Ver Deudas' }}
                        icon={<DuesIcon />}
                      />
                    )}

                    {permissions.payments.read && (
                      <Button
                        type="text"
                        onClick={() => {
                          navigate(
                            `/${AppUrl.PAYMENTS}${UrlUtils.stringify({
                              filters: {
                                memberId: [movement.paymentMemberId],
                              },
                            })}`,
                            { state: gridState },
                          );
                        }}
                        htmlType="button"
                        tooltip={{ title: 'Ver Pago' }}
                        icon={<PaymentsIcon />}
                      />
                    )}

                    {permissions.member.read && (
                      <Button
                        type="text"
                        onClick={() => {
                          navigate(
                            `/${AppUrl.MEMBERS}${UrlUtils.stringify({
                              filters: {
                                id: [movement.paymentMemberId],
                              },
                            })}`,
                            { state: gridState },
                          );
                        }}
                        htmlType="button"
                        tooltip={{ title: 'Ver Socio' }}
                        icon={<UserIcon />}
                      />
                    )}
                  </Space.Compact>
                )
              );
            },
            title: 'Acciones',
            width: 125,
          },
        ]}
      />
    </Card>
  );
};
