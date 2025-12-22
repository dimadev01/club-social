import type { PaginatedResponse } from '@club-social/shared/types';

import {
  FileExcelOutlined,
  FilterOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  type IPaymentPaginatedDto,
  PaymentStatus,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { queryKeys } from '@/shared/lib/query-keys';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function PaymentList() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    setFilter,
    state,
  } = useTable<IPaymentPaginatedDto>({
    defaultFilters: {
      status: [PaymentStatus.PAID],
    },
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const [filteredMemberIds, setFilteredMemberIds] = useState(
    getFilterValue('memberId') ?? [],
  );
  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const { data: payments, isLoading } = useQuery({
    ...queryKeys.payments.paginated(query),
    enabled: permissions.payments.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IPaymentPaginatedDto>>('payments/paginated', {
        query,
      }),
  });

  if (!permissions.payments.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          {permissions.payments.create && (
            <Button
              disabled={!permissions.payments.create}
              icon={<AddNewIcon />}
              onClick={() => navigate(appRoutes.payments.new)}
              type="primary"
            >
              Nuevo pago
            </Button>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  icon: <FileExcelOutlined />,
                  key: 'export',
                  label: 'Exportar',
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space.Compact>
      }
      title="Pagos"
    >
      <PageTableActions>
        <TableMembersSearch
          isLoading={isSelectedMembersLoading}
          onFilterChange={(value) => setFilter('memberId', value)}
          selectedMembers={selectedMembers}
          value={getFilterValue('memberId') ?? undefined}
        />
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IPaymentPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),

            filteredValue: getFilterValue('createdAt'),
            render: (createdAt: string, record) => (
              <Link to={appRoutes.payments.view(record.id)}>
                {DateFormat.date(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
            width: 150,
          },
          {
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),

            filteredValue: getFilterValue('date'),
            render: (date: string) => DateFormat.date(date),
            title: 'Fecha',
            width: 150,
          },
          {
            dataIndex: 'memberId',
            render: (memberId: string, record: IPaymentPaginatedDto) => (
              <Link to={appRoutes.members.view(memberId)}>
                {record.memberName}
              </Link>
            ),
            title: 'Socio',
            width: 200,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.formatCents(amount),
            title: 'Monto',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'status',

            filteredValue: getFilterValue('status'),
            filterMode: 'tree',
            filters: Object.entries(PaymentStatusLabel).map(
              ([value, label]) => ({
                text: label,
                value,
              }),
            ),
            render: (value: PaymentStatus) => PaymentStatusLabel[value],
            title: 'Estado',
            width: 100,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Tooltip title="Filtrar por este socio">
                  <Link
                    to={{
                      pathname: appRoutes.payments.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.memberId}`,
                      }).toString(),
                    }}
                  >
                    <Button
                      disabled={getFilterValue('memberId')?.includes(
                        record.memberId,
                      )}
                      icon={<FilterOutlined />}
                      onClick={() => setFilteredMemberIds([record.memberId])}
                      type="text"
                    />
                  </Link>
                </Tooltip>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: 100,
          },
        ]}
        dataSource={payments?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: payments?.total,
        }}
      />
    </Page>
  );
}
