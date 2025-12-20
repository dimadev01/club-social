import type { PaginatedResponse } from '@club-social/shared/types';

import {
  FileExcelOutlined,
  FilterOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { DueStatus, DueStatusLabel } from '@club-social/shared/dues';
import {
  type IPaymentPaginatedDto,
  PaymentStatus,
} from '@club-social/shared/payments';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function PaymentListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
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

  const memberSelectQuery = useMembersForSelect({
    memberIds: getFilterValue('memberId') ?? [],
  });

  const paymentsQuery = useQuery({
    enabled: permissions.payments.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IPaymentPaginatedDto>>('/payments/paginated', {
        query,
      }),
    queryKey: ['payments', state, query],
  });

  if (paymentsQuery.error) {
    message.error(paymentsQuery.error.message);
  }

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
              onClick={() => navigate(APP_ROUTES.PAYMENT_NEW)}
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
          isFetching={memberSelectQuery.isFetching}
          onFilterChange={(value) => setFilter('memberId', value)}
          selectedMembers={memberSelectQuery.data}
          value={
            memberSelectQuery.data?.map((member) => member.id) ?? undefined
          }
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
              <Link to={`${APP_ROUTES.DUE_LIST}/${record.id}`}>
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
              <Link to={`${APP_ROUTES.MEMBER_LIST}/${memberId}`}>
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
            filters: Object.entries(DueStatusLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (value: DueStatus) => DueStatusLabel[value],
            title: 'Estado',
            width: 100,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Tooltip title="Filtrar por este socio">
                  <Button
                    disabled={getFilterValue('memberId')?.includes(
                      record.memberId,
                    )}
                    icon={<FilterOutlined />}
                    onClick={() => {
                      setFilter('memberId', [record.memberId]);
                    }}
                    type="text"
                  />
                </Tooltip>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: 100,
          },
        ]}
        dataSource={paymentsQuery.data?.data}
        loading={paymentsQuery.isFetching}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: paymentsQuery.data?.total,
        }}
      />
    </Page>
  );
}
