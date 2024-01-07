import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Checkbox,
  DatePicker,
  Descriptions,
  Form,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import invariant from 'ts-invariant';
import {
  CheckOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusColor,
  DueStatusEnum,
  DueStatusLabel,
  getDueCategoryOptions,
  getDueStatusColumnFilters,
} from '@domain/dues/due.enum';
import { DueGridDto } from '@domain/dues/use-cases/get-dues-grid/due-grid.dto';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Select } from '@ui/components/Select';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useDeleteDue } from '@ui/hooks/dues/useDeleteDue';
import { useDuesGrid } from '@ui/hooks/dues/useDuesGrid';
import { useRestoreDue } from '@ui/hooks/dues/useRestoreDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useGrid } from '@ui/hooks/useGrid';

export const DuesPage = () => {
  const location = useLocation();

  const navigate = useNavigate();

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

  const restoreDue = useRestoreDue(refetch);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const userId = Meteor.userId();

  if (!userId) {
    return null;
  }

  const renderFooter = () => (
    <Descriptions>
      <Descriptions.Item label="Total deudas">
        {data?.totalDues}
      </Descriptions.Item>
      <Descriptions.Item label="Total pagos">
        {data?.totalPayments}
      </Descriptions.Item>
      <Descriptions.Item label="Balance">{data?.balance}</Descriptions.Item>
    </Descriptions>
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
            footer={renderFooter}
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
                dataIndex: 'memberId',
                render: (memberId: string, dto: DueGridDto) => (
                  <NavLink to={`${AppUrl.Members}/${memberId}`}>
                    {dto.memberName}
                  </NavLink>
                ),
                title: 'Socio',
              },
              {
                align: 'center',
                dataIndex: 'category',
                filteredValue: gridState.filters?.category ?? [],
                filters: getDueCategoryOptions().map((category) => ({
                  text: category.label,
                  value: category.value,
                })),
                render: (category: DueCategoryEnum) =>
                  DueCategoryLabel[category],
                title: 'Categoría',
              },
              {
                align: 'center',
                dataIndex: 'membershipMonth',
                filteredValue: gridState.filters?.membershipMonth ?? [],
                filters: DateUtils.months().map((month) => ({
                  text: month,
                  value: month,
                })),
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
                  if (due.isPaid) {
                    invariant(due.payments);

                    return (
                      <Tooltip
                        title={due.payments.map((d) => (
                          <span key={d.paidAt} className="block">
                            {d.paidAt}
                          </span>
                        ))}
                      >
                        <Tag color={DueStatusColor[status]}>
                          {DueStatusLabel[status]} ({due.paidAmount})
                        </Tag>
                      </Tooltip>
                    );
                  }

                  if (due.isPartiallyPaid) {
                    invariant(due.payments);

                    return (
                      <Tooltip
                        title={due.payments.map(
                          (d) => `${d.paidAt} ${d.amount}`
                        )}
                      >
                        <Tag color={DueStatusColor[status]}>
                          {DueStatusLabel[status]} ({due.paidAmount})
                        </Tag>
                      </Tooltip>
                    );
                  }

                  return (
                    <Tag color={DueStatusColor[status]}>
                      {DueStatusLabel[status]}
                    </Tag>
                  );
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
                        ScopeEnum.Dues
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
                            title: '¿Está seguro de eliminar este cobro?',
                          }}
                          type="text"
                          htmlType="button"
                          tooltip={{ title: 'Eliminar' }}
                          icon={<DeleteOutlined />}
                          loading={deleteDue.variables?.id === due._id}
                          disabled={deleteDue.variables?.id === due._id}
                        />
                      )}

                    {due.isDeleted &&
                      Roles.userIsInRole(
                        userId,
                        PermissionEnum.Update,
                        ScopeEnum.Dues
                      ) && (
                        <Button
                          type="text"
                          onClick={() =>
                            restoreDue.mutate(
                              { id: due._id },
                              {
                                onError: () => restoreDue.reset(),
                                onSuccess: () => restoreDue.reset(),
                              }
                            )
                          }
                          htmlType="button"
                          tooltip={{ title: 'Restaurar' }}
                          icon={<ReloadOutlined />}
                          loading={restoreDue.variables?.id === due._id}
                          disabled={restoreDue.variables?.id === due._id}
                        />
                      )}

                    <Button
                      type="text"
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

                    <Button
                      type="text"
                      onClick={() => {
                        navigate(
                          UrlUtils.navigate(AppUrl.PaymentsNew, {
                            memberIds: [due.memberId],
                          })
                        );
                      }}
                      htmlType="button"
                      disabled={due.isPaid}
                      tooltip={{ title: 'Cobrar' }}
                      icon={<CheckOutlined />}
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
