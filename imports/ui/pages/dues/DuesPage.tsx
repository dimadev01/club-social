import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Space,
  Tooltip,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import { DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusEnum,
  DueStatusLabel,
  getDueStatusColumnFilters,
} from '@domain/dues/due.enum';
import { DueGridDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.dto';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Select } from '@ui/components/Select';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useCategories } from '@ui/hooks/categories/useCategories';
import { useDeleteDue } from '@ui/hooks/dues/useDeleteDue';
import { useDuesGrid } from '@ui/hooks/dues/useDuesGrid';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useGrid } from '@ui/hooks/useGrid';

export const DuesPage = () => {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [gridState, setGridState] = useGrid({
    sortField: 'date',
    sortOrder: 'descend',
  });

  const [memberIdsFilter, setMemberIdsFilter] = useState<string[]>(
    (parsedQs.memberIds as string[]) ?? []
  );

  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<RangeValue<Dayjs> | null>(
    parsedQs.from && parsedQs.to
      ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
      : null
  );

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const { data, isLoading, isRefetching, refetch } = useDuesGrid({
    filters: gridState.filters,
    from: dateFilter
      ? dateFilter[0]?.format(DateFormatEnum.Date) ?? null
      : null,
    memberIds: memberIdsFilter ?? [],
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    showDeleted,
    sortField: gridState.sortField as 'createdAt',
    sortOrder: gridState.sortOrder,
    to: dateFilter ? dateFilter[1]?.format(DateFormatEnum.Date) ?? null : null,
  });

  const deleteDue = useDeleteDue(refetch);

  const { data: categories } = useCategories();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const userId = Meteor.userId();

  if (!userId) {
    return null;
  }

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
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            {Roles.userIsInRole(
              user,
              PermissionEnum.Create,
              ScopeEnum.Dues
            ) && <TableNewButton to={AppUrl.DuesNew} />}
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

              <Form.Item>
                <Select
                  value={memberIdsFilter}
                  mode="multiple"
                  onChange={(value) => {
                    setMemberIdsFilter(value ?? null);

                    setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                  className="!min-w-[333px]"
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
                PermissionEnum.ViewDeleted,
                ScopeEnum.Movements
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

          <Table<DueGridDto>
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
                render: (date: string, due: DueGridDto) => (
                  <NavLink to={`${AppUrl.Dues}/${due._id}`}>{date}</NavLink>
                ),
                sorter: true,
                title: 'Fecha',
              },
              {
                dataIndex: 'memberName',
                title: 'Socio',
              },
              {
                align: 'center',
                dataIndex: 'category',
                filteredValue: gridState.filters?.category ?? [],
                filters:
                  categories?.map((category) => ({
                    text: category.name,
                    value: category.code,
                  })) ?? [],
                render: (category: DueCategoryEnum) =>
                  DueCategoryLabel[category],
                title: 'Categoría',
              },
              {
                align: 'center',
                dataIndex: 'membershipMonth',
                title: 'Mes de cuota',
              },
              {
                align: 'right',
                dataIndex: 'amount',
                title: 'Importe',
              },
              {
                align: 'center',
                dataIndex: 'status',
                filteredValue: gridState.filters?.status ?? [],
                filters: getDueStatusColumnFilters(),
                render: (status: DueStatusEnum, due: DueGridDto) => {
                  if (status === DueStatusEnum.Paid) {
                    return (
                      <Tooltip title={`${due.paidAt} - ${due.paidAmount}`}>
                        {DueStatusLabel[status]}
                      </Tooltip>
                    );
                  }

                  return DueStatusLabel[status];
                },
                title: 'Estado',
              },
              {
                align: 'center',
                render: (_, due: DueGridDto) => (
                  <ButtonGroup size="small">
                    {!due.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        PermissionEnum.Delete,
                        ScopeEnum.Movements
                      ) && (
                        <Button
                          popConfirm={{
                            onConfirm: () =>
                              deleteDue.mutate(
                                { id: due._id },
                                {
                                  onError: () => deleteDue.reset(),
                                  onSuccess: () => deleteDue.reset(),
                                }
                              ),
                            title: '¿Está seguro de eliminar este movimiento?',
                          }}
                          type="ghost"
                          htmlType="button"
                          tooltip={{ title: 'Eliminar' }}
                          icon={<DeleteOutlined />}
                          loading={deleteDue.variables?.id === due._id}
                          disabled={deleteDue.variables?.id === due._id}
                        />
                      )}

                    {/* {due.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        PermissionEnum.Update,
                        ScopeEnum.Dues
                      ) && (
                        <Button
                          type="ghost"
                          onClick={() =>
                            restoreMovement.mutate({ id: due._id })
                          }
                          htmlType="button"
                          tooltip={{ title: 'Restaurar' }}
                          icon={<ReloadOutlined />}
                          loading={restoreMovement.variables?.id === due._id}
                          disabled={restoreMovement.variables?.id === due._id}
                        />
                      )} */}

                    <Button
                      type="ghost"
                      disabled={!due.memberId}
                      onClick={() => {
                        if (due.memberId) {
                          setMemberIdsFilter([due.memberId]);
                        }
                      }}
                      htmlType="button"
                      tooltip={{ title: 'Filtrar por este socio' }}
                      icon={<FilterOutlined />}
                    />
                  </ButtonGroup>
                ),
                title: 'Acciones',
                width: 100,
              },
            ]}
          />
        </Space>
      </Card>
    </>
  );
};
