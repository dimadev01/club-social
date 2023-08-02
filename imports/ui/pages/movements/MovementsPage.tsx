import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Space,
  Table as AntTable,
  Tag,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { NavLink, useLocation } from 'react-router-dom';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryType,
  getCategoryFilters,
  MemberCategories,
} from '@domain/enums/categories.enum';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Select } from '@ui/components/Select';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeleteMovement } from '@ui/hooks/movements/useDeleteMovement';
import { useMovementsGrid } from '@ui/hooks/movements/useMovementsGrid';
import { useRestoreMovement } from '@ui/hooks/movements/useRestoreMovement';
import { useGrid } from '@ui/hooks/useGrid';

export const MovementsPage = () => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const [memberIdSearchValue, setMemberIdSearchValue] = useState<string>(
    (parsedQs.memberId as string) ?? undefined
  );

  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [dateRangeValue, setDateRangeValue] =
    useState<RangeValue<Dayjs> | null>(
      parsedQs.from && parsedQs.to
        ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
        : null
    );

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const { data, isLoading, isRefetching, refetch } = useMovementsGrid({
    filters: gridState.filters,
    from: dateRangeValue
      ? dateRangeValue[0]?.format(DateFormats.Date) ?? null
      : null,
    memberId: memberIdSearchValue ?? null,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    showDeleted,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
    to: dateRangeValue
      ? dateRangeValue[1]?.format(DateFormats.Date) ?? null
      : null,
  });

  const deleteMovement = useDeleteMovement(refetch);

  const restoreMovement = useRestoreMovement(refetch);

  const renderSummary = () => (
    <AntTable.Summary>
      <AntTable.Summary.Row>
        <AntTable.Summary.Cell index={0}>
          <div className="flex justify-between">
            <span>Entrada</span>
            <span>
              {data ? CurrencyUtils.formatCents(data.income, false) : ''}
            </span>
          </div>
        </AntTable.Summary.Cell>

        <AntTable.Summary.Cell index={1}>
          <div className="flex justify-between">
            <span>Salida</span>
            <span>
              {data ? CurrencyUtils.formatCents(data.expense, false) : ''}
            </span>
          </div>
        </AntTable.Summary.Cell>

        <AntTable.Summary.Cell index={2}>
          <div className="flex justify-between">
            <span>Deudas</span>
            <span>
              {data ? CurrencyUtils.formatCents(data.debt, false) : ''}
            </span>
          </div>
        </AntTable.Summary.Cell>

        <AntTable.Summary.Cell index={3}>
          <div className="flex justify-between">
            <span>Balance</span>
            <span>
              {data ? CurrencyUtils.formatCents(data.balance, false) : ''}
            </span>
          </div>
        </AntTable.Summary.Cell>
        <AntTable.Summary.Cell index={4} />
      </AntTable.Summary.Row>
    </AntTable.Summary>
  );

  const userId = Meteor.userId();

  if (!userId) {
    return null;
  }

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Movimientos',
          },
        ]}
      />

      <Card
        title="Movimientos"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <TableNewButton to={AppUrl.MovementsNew} />
          </>
        }
      >
        <Space size="middle" direction="vertical" className="flex">
          <Form layout="inline">
            <Space wrap>
              <Form.Item>
                <DatePicker.RangePicker
                  format={DateFormats.DD_MM_YYYY}
                  allowClear
                  value={dateRangeValue}
                  disabledDate={(current) => current.isAfter(dayjs())}
                  onChange={(value) => {
                    setDateRangeValue(value);

                    setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Select
                  value={memberIdSearchValue}
                  onChange={(value) => {
                    setMemberIdSearchValue(value ?? undefined);

                    setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                  className="!min-w-[200px]"
                  disabled={isLoadingMembers || isLoading}
                  loading={isLoadingMembers}
                  placeholder="Buscar por socios"
                  options={
                    members?.map((member: GetMembersDto) => ({
                      label: member.name,
                      value: member._id,
                    })) ?? []
                  }
                />
              </Form.Item>

              {Roles.userIsInRole(
                userId,
                Permission.ViewDeleted,
                Scope.Movements
              ) && (
                <Form.Item>
                  <Checkbox
                    value={showDeleted}
                    onChange={(e) => setShowDeleted(e.target.checked)}
                  >
                    Ver eliminados
                  </Checkbox>
                </Form.Item>
              )}
            </Space>
          </Form>

          <Table<MovementGridDto>
            total={data?.count ?? 0}
            gridState={gridState}
            onStateChange={setGridState}
            loading={isLoading}
            dataSource={data?.data}
            columns={[
              {
                dataIndex: 'date',
                render: (date: string, movement: MovementGridDto) => (
                  <NavLink to={`${AppUrl.Movements}/${movement._id}`}>
                    {date}
                  </NavLink>
                ),
                title: 'Fecha',
              },
              {
                align: 'center',
                dataIndex: 'category',
                filteredValue: gridState.filters?.category ?? [],
                filters: getCategoryFilters(),
                render: (category: CategoryEnum) => CategoryLabel[category],
                title: 'Categoría',
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount: string, movement: MovementGridDto) => {
                  if (movement.type === CategoryType.Expense) {
                    return <Tag color="red">{amount}</Tag>;
                  }

                  if (movement.type === CategoryType.Income) {
                    return <Tag color="green">{amount}</Tag>;
                  }

                  return <Tag>{amount}</Tag>;
                },
                title: 'Importe',
              },
              {
                dataIndex: 'details',
                render: (details: string | null, movement: MovementGridDto) => {
                  if (MemberCategories.includes(movement.category)) {
                    return (
                      <NavLink to={`${AppUrl.Members}/${movement.memberId}`}>
                        {details}
                      </NavLink>
                    );
                  }

                  return details;
                },
                title: 'Detalle',
              },
              {
                align: 'center',
                render: (_, movement: MovementGridDto) => (
                  <>
                    {!movement.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        Permission.Delete,
                        Scope.Movements
                      ) && (
                        <Button
                          popConfirm={{
                            onConfirm: () =>
                              deleteMovement.mutate(
                                { id: movement._id },
                                {
                                  onError: () => deleteMovement.reset(),
                                  onSuccess: () => deleteMovement.reset(),
                                }
                              ),
                            title: '¿Está seguro de eliminar este movimiento?',
                          }}
                          type="ghost"
                          htmlType="button"
                          tooltip={{ title: 'Eliminar' }}
                          icon={<DeleteOutlined />}
                          loading={
                            deleteMovement.variables?.id === movement._id
                          }
                          disabled={
                            deleteMovement.variables?.id === movement._id
                          }
                        />
                      )}

                    {movement.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        Permission.Update,
                        Scope.Movements
                      ) && (
                        <Button
                          type="ghost"
                          onClick={() =>
                            restoreMovement.mutate({ id: movement._id })
                          }
                          htmlType="button"
                          tooltip={{ title: 'Restaurar' }}
                          icon={<ReloadOutlined />}
                          loading={
                            restoreMovement.variables?.id === movement._id
                          }
                          disabled={
                            restoreMovement.variables?.id === movement._id
                          }
                        />
                      )}
                  </>
                ),
                title: 'Acciones',
                width: 100,
              },
            ]}
            summary={renderSummary}
          />
        </Space>
      </Card>
    </>
  );
};
