import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Form, Space } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { GetDuesGridRequest } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.request';
import { GetDuesGridResponse } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.response';
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
import { TableFilterByMemberButton } from '@ui/components/Table/TableFilterByMember';
import { Grid } from '@ui/components/Table/TableNew';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useDeleteDue } from '@ui/hooks/dues/useDeleteDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const DuesPage = () => {
  const { gridState, onTableChange, setState } = useTable<DueGridDto>({
    defaultFilters: { status: [DueStatusEnum.PENDING] },
    defaultSorter: { date: 'descend' },
  });

  const navigate = useNavigate();

  const { data: members } = useMembers({});

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetDuesGridRequest,
    GetDuesGridResponse
  >({
    methodName: MeteorMethodEnum.DuesGetGrid,
    request: {
      filterByMember: gridState.filters?.memberId,
      filterByStatus: gridState.filters?.status as DueStatusEnum[],
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
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            {SecurityUtils.isInRole(PermissionEnum.CREATE, ScopeEnum.DUES) && (
              <TableNewButton to={AppUrl.DuesNew} />
            )}
          </>
        }
      >
        <Space size="middle" direction="vertical" className="flex">
          <Form layout="inline">
            <Space wrap>
              {/* <Form.Item>
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
              </Form.Item> */}
            </Space>
          </Form>

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
                filteredValue: gridState.filters?.memberId,
                filters:
                  members?.map((member) => ({
                    text: member.name,
                    value: member.id,
                  })) ?? [],
                render: (_, payment: DueGridDto) => payment.memberName,
                title: 'Socio',
              },
              {
                align: 'center',
                dataIndex: 'category',
                render: (category: DueCategoryEnum) =>
                  DueCategoryLabel[category],
                title: 'Categoría',
                width: 150,
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount) => new Money({ amount }).formatWithCurrency(),
                title: 'Importe',
                width: 100,
              },
              {
                align: 'center',
                dataIndex: 'status',
                defaultFilteredValue: [DueStatusEnum.PENDING],
                filterResetToDefaultFilteredValue: true,
                filteredValue: gridState.filters?.status,
                filters: getDueStatusColumnFilters(),
                render: (status: DueStatusEnum) => DueStatusLabel[status],
                title: 'Estado',
                width: 150,
              },
              {
                align: 'center',
                render: (_, due: DueGridDto) => (
                  <ButtonGroup size="small">
                    {!due.isDeleted &&
                      SecurityUtils.isInRole(
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
                          disabled={deleteDue.variables?.id === due.id}
                        />
                      )}

                    {/* <Button
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
                    /> */}

                    <TableFilterByMemberButton
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
