import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Table as AntTable,
  Breadcrumb,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Space,
  Tag,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import {
  CategoryEnum,
  CategoryLabel,
  CategoryTypeEnum,
  MemberCategories,
} from '@domain/categories/category.enum';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { TableOld } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
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

  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<RangeValue<Dayjs> | null>(
    parsedQs.from && parsedQs.to
      ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
      : null,
  );

  const { data, isLoading, isRefetching, refetch } = useMovementsGrid({
    filters: gridState.filters,
    from: dateFilter
      ? dateFilter[0]?.format(DateFormatEnum.DATE) ?? null
      : null,
    memberIds: [],
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    showDeleted,
    sortField: gridState.sortField as 'createdAt',
    sortOrder: gridState.sortOrder,
    to: dateFilter ? dateFilter[1]?.format(DateFormatEnum.DATE) ?? null : null,
  });

  const deleteMovement = useDeleteMovement(refetch);

  const restoreMovement = useRestoreMovement(refetch);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const renderSummary = () => (
    <AntTable.Summary>
      <AntTable.Summary.Row>
        <AntTable.Summary.Cell index={0}>
          <div className="flex justify-between">
            <span>Entrada</span>
            <span>{data ? MoneyUtils.formatCents(data.income) : ''}</span>
          </div>
        </AntTable.Summary.Cell>

        <AntTable.Summary.Cell index={1}>
          <div className="flex justify-between">
            <span>Salida</span>
            <span>{data ? MoneyUtils.formatCents(data.expense) : ''}</span>
          </div>
        </AntTable.Summary.Cell>

        <AntTable.Summary.Cell index={2}>
          <div className="flex justify-between">
            <span>Deudas</span>
            <span>{data ? MoneyUtils.formatCents(data.debt) : ''}</span>
          </div>
        </AntTable.Summary.Cell>

        <AntTable.Summary.Cell index={3}>
          <div className="flex justify-between">
            <span>Balance</span>
            <span>{data ? MoneyUtils.formatCents(data.balance) : ''}</span>
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
        items={[{ title: 'Inicio' }, { title: 'Movimientos' }]}
      />

      <Card
        title="Movimientos"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            {Roles.userIsInRole(
              user,
              PermissionEnum.CREATE,
              ScopeEnum.MOVEMENTS,
            ) && <TableNewButton to={AppUrl.MovementsNew} />}
          </>
        }
      >
        <Space size="middle" direction="vertical" className="flex">
          <Form layout="inline">
            <Space wrap>
              <Form.Item>
                <DatePicker.RangePicker
                  format={DateFormatEnum.DDMMYYYY}
                  allowClear
                  value={dateFilter}
                  disabledDate={(current) => current.isAfter(dayjs())}
                  onChange={(value) => {
                    setDateFilter(value);

                    setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                />
              </Form.Item>

              {Roles.userIsInRole(
                userId,
                PermissionEnum.VIEW_DELETED,
                ScopeEnum.MOVEMENTS,
              ) && (
                <Form.Item>
                  <Checkbox
                    checked={showDeleted}
                    onChange={(e) => setShowDeleted(e.target.checked)}
                  >
                    Ver eliminados
                  </Checkbox>
                </Form.Item>
              )}
            </Space>
          </Form>

          <TableOld<MovementGridDto>
            total={data?.count ?? 0}
            gridState={gridState}
            onStateChange={setGridState}
            loading={isLoading}
            dataSource={data?.data}
            columns={[
              {
                dataIndex: 'date',
                defaultSortOrder:
                  gridState.sortField === 'date'
                    ? gridState.sortOrder
                    : undefined,
                render: (date: string, movement: MovementGridDto) => (
                  <Link to={`${AppUrl.Movements}/${movement._id}`}>{date}</Link>
                ),
                sorter: true,
                title: 'Fecha',
              },
              {
                align: 'center',
                dataIndex: 'category',
                render: (category: CategoryEnum) => CategoryLabel[category],
                title: 'Categoría',
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount: string, movement: MovementGridDto) => {
                  if (movement.type === CategoryTypeEnum.Expense) {
                    return <Tag color="red">{amount}</Tag>;
                  }

                  if (movement.type === CategoryTypeEnum.Income) {
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
                      <Link to={`${AppUrl.Members}/${movement.memberId}`}>
                        {details}
                      </Link>
                    );
                  }

                  return details;
                },
                title: 'Detalle',
              },
              {
                align: 'center',
                render: (_, movement: MovementGridDto) => (
                  <ButtonGroup size="small">
                    {!movement.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        PermissionEnum.DELETE,
                        ScopeEnum.MOVEMENTS,
                      ) && (
                        <Button
                          popConfirm={{
                            onConfirm: () =>
                              deleteMovement.mutate(
                                { id: movement._id },
                                {
                                  onError: () => deleteMovement.reset(),
                                  onSuccess: () => deleteMovement.reset(),
                                },
                              ),
                            title: '¿Está seguro de eliminar este movimiento?',
                          }}
                          type="text"
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
                        PermissionEnum.UPDATE,
                        ScopeEnum.MOVEMENTS,
                      ) && (
                        <Button
                          type="text"
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
                  </ButtonGroup>
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
