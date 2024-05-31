import { DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import {
  Table as AntTable,
  Breadcrumb,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Space,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'qs';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { GetPaymentGridResponse } from '@domain/payments/use-cases/get-payments-grid/get-payment-grid.response';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { MembersSelect } from '@ui/components/Members/MembersSelect';
import { TableNewV } from '@ui/components/Table/TableNew';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const PaymentsPage = () => {
  const { gridState, setGridState } = useTable<GetPaymentGridResponse>({
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    defaultSorter: { date: 'descend' },
  });

  const { data: members } = useMembers();

  const {
    data: payments,
    isLoading,
    refetch,
    isRefetching,
  } = useQueryGrid<GetPaymentGridResponse>({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request: {
      limit: gridState.pageSize,
      page: gridState.page,
      sorter: gridState.sorter,
    },
  });

  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [memberIdsFilter, setMemberIdsFilter] = useState<string[]>(
    (parsedQs.memberIds as string[]) ?? [],
  );

  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<RangeValue<Dayjs> | null>(
    parsedQs.from && parsedQs.to
      ? [dayjs(parsedQs.from as string), dayjs(parsedQs.to as string)]
      : null,
  );

  const deletePayment = useDeletePayment(refetch);

  // const expandedRowRender = (payment: GetPaymentGridResponse) => (
  //   <AntTable
  //     rowKey="dueId"
  //     pagination={false}
  //     bordered
  //     columns={[
  //       {
  //         dataIndex: 'dueDate',
  //         render: (dueDate: string, due: PaymentDueGridDto) => (
  //           <Link to={`${AppUrl.Dues}/${due.dueId}`}>{dueDate}</Link>
  //         ),
  //         title: 'Fecha',
  //         width: 150,
  //       },
  //       {
  //         align: 'center',
  //         dataIndex: 'dueCategory',
  //         render: (dueCategory: DueCategoryEnum) =>
  //           DueCategoryLabel[dueCategory],
  //         title: 'Categoría',
  //       },
  //       {
  //         align: 'center',
  //         dataIndex: 'membershipMonth',
  //         title: 'Mes de cuota',
  //       },
  //       {
  //         align: 'right',
  //         dataIndex: 'dueAmount',
  //         title: 'Deuda',
  //       },
  //       {
  //         align: 'right',
  //         dataIndex: 'paymentAmount',
  //         title: 'Pagado',
  //       },
  //     ]}
  //     dataSource={payment.dues}
  //   />
  // );

  const renderSummary = () => (
    <AntTable.Summary>
      <AntTable.Summary.Row>
        <AntTable.Summary.Cell index={0} />
        <AntTable.Summary.Cell index={1} />
        <AntTable.Summary.Cell index={2} />
        <AntTable.Summary.Cell index={3} />
        <AntTable.Summary.Cell index={4}>
          <div className="text-right">Total -</div>
          {/* <div className="text-right">Total {data?.totalAmount ?? '-'}</div> */}
        </AntTable.Summary.Cell>
        <AntTable.Summary.Cell index={5} />
        <AntTable.Summary.Cell index={6} />
      </AntTable.Summary.Row>
    </AntTable.Summary>
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Pagos' }]}
      />

      <Card
        title="Pagos"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            {SecurityUtils.isInRole(
              PermissionEnum.CREATE,
              ScopeEnum.PAYMENTS,
            ) && <TableNewButton to={AppUrl.PaymentsNew} />}
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

                    // setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                />
              </Form.Item>

              <Form.Item>
                <MembersSelect
                  value={memberIdsFilter}
                  mode="multiple"
                  onChange={(value) => {
                    setMemberIdsFilter(value ?? null);

                    // setGridState((prevState) => ({ ...prevState, page: 1 }));
                  }}
                  className="!min-w-[333px]"
                />
              </Form.Item>

              {SecurityUtils.isInRole(
                PermissionEnum.VIEW_DELETED,
                ScopeEnum.PAYMENTS,
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

          <TableNewV<GetPaymentGridResponse>
            state={gridState}
            // summary={renderSummary}
            setGridState={setGridState}
            loading={isLoading}
            dataSource={payments?.items}
            // expandable={{ expandedRowRender }}
            columns={[
              {
                dataIndex: 'date',
                render: (date: string, payment: GetPaymentGridResponse) => (
                  <Link to={`${AppUrl.Payments}/${payment._id}`}>{date}</Link>
                ),
                title: 'Fecha',
                width: 150,
              },
              {
                dataIndex: 'memberId',
                filterSearch: true,
                filteredValue: gridState.filters?.memberId,
                filters:
                  members?.map((member) => ({
                    text: member.name,
                    value: member._id,
                  })) ?? [],
                title: 'Socio',
              },
              {
                align: 'right',
                dataIndex: 'paymentDuesCount',
                title: '#',
                width: 50,
              },
              // {
              //   align: 'right',
              //   dataIndex: 'totalAmount',
              //   title: 'Total',
              //   width: 150,
              // },
              // {
              //   align: 'right',
              //   dataIndex: 'receiptNumber',
              //   title: 'Recibo #',
              //   width: 100,
              // },
              {
                align: 'center',
                render: (_, payment: GetPaymentGridResponse) => (
                  <Space.Compact size="small">
                    {!payment.isDeleted &&
                      SecurityUtils.isInRole(
                        PermissionEnum.DELETE,
                        ScopeEnum.PAYMENTS,
                      ) && (
                        <Button
                          popConfirm={{
                            onConfirm: () =>
                              deletePayment.mutate(
                                { id: payment._id },
                                {
                                  onError: () => deletePayment.reset(),
                                  onSuccess: () => deletePayment.reset(),
                                },
                              ),
                            title: '¿Está seguro de eliminar este pago?',
                          }}
                          type="text"
                          htmlType="button"
                          tooltip={{ title: 'Eliminar' }}
                          icon={<DeleteOutlined />}
                          loading={deletePayment.variables?.id === payment._id}
                          disabled={deletePayment.variables?.id === payment._id}
                        />
                      )}
                    <Button
                      type="text"
                      disabled={!payment.memberId}
                      onClick={() => {
                        if (payment.memberId) {
                          setMemberIdsFilter([payment.memberId]);
                        }
                      }}
                      htmlType="button"
                      tooltip={{ title: 'Filtrar por este socio' }}
                      icon={<FilterOutlined />}
                    />
                  </Space.Compact>
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
