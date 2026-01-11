import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { FilterOutlined, MoreOutlined } from '@ant-design/icons';
import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  type PaymentPaginatedDto,
  type PaymentPaginatedExtraDto,
  PaymentStatus,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
import { keepPreviousData } from '@tanstack/react-query';
import { Divider, Dropdown, Space, type TableColumnType } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { DueCategoryIconLabel } from '@/dues/DueCategoryIconLabel';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import {
  Button,
  Card,
  DuesIcon,
  NavigateToMember,
  NavigateToPayment,
  NotFound,
  PageTableActions,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  TableDateRangeFilterDropdown,
  TableMembersSearch,
  useTable,
} from '@/ui';
import { TableSummaryTotalFilterText } from '@/ui/Table/TableSummaryTotalFilterText';
import { usePermissions } from '@/users/use-permissions';

export function PaymentList() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const {
    clearFilters,
    exportQuery,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    setFilter,
    state,
  } = useTable<PaymentPaginatedDto>({
    defaultSort: [{ field: 'date', order: 'descend' }],
  });

  const [filteredMemberIds, setFilteredMemberIds] = useState(
    getFilterValue('memberId') ?? [],
  );

  const { exportData, isExporting } = useExport({
    endpoint: '/payments/export',
    filename: `pagos-${DateFormat.isoDate(new Date())}.csv`,
  });

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const { data: payments, isLoading } = useQuery({
    ...queryKeys.payments.paginated(query),
    enabled: permissions.payments.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<
        PaginatedDataResultDto<PaymentPaginatedDto, PaymentPaginatedExtraDto>
      >('payments/paginated', { query }),
  });

  if (!permissions.payments.list) {
    return <NotFound />;
  }

  return (
    <Card
      extra={
        <Space.Compact>
          {permissions.payments.create && (
            <Button
              disabled={!permissions.payments.create}
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
                  disabled: isExporting,
                  key: 'export',
                  label: 'Exportar',
                  onClick: () => exportData(exportQuery),
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
        {permissions.payments.listAll && (
          <TableMembersSearch
            isLoading={isSelectedMembersLoading}
            onFilterChange={(value) => setFilter('memberId', value)}
            selectedMembers={selectedMembers}
            value={getFilterValue('memberId') ?? undefined}
          />
        )}
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<PaymentPaginatedDto>
        columns={[
          {
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),
            filteredValue: getFilterValue('date'),
            fixed: 'left',
            render: (date: string, record: PaymentPaginatedDto) => (
              <NavigateToPayment id={record.id}>{date}</NavigateToPayment>
            ),
            sorter: true,
            sortOrder: getSortOrder('date'),
            title: 'Fecha',
          },
          ...(permissions.payments.listAll
            ? [
                {
                  dataIndex: 'memberId',
                  render: (memberId: string, record: PaymentPaginatedDto) => (
                    <NavigateToMember id={memberId}>
                      {record.memberName}
                    </NavigateToMember>
                  ),
                  title: 'Socio',
                  width: TABLE_COLUMN_WIDTHS.MEMBER_NAME,
                } satisfies TableColumnType<PaymentPaginatedDto>,
              ]
            : []),
          {
            dataIndex: 'categories',
            filteredValue: getFilterValue('categories'),
            filters: labelMapToFilterOptions(DueCategoryLabel).map(
              ({ value }) => ({
                text: <DueCategoryIconLabel category={value as DueCategory} />,
                value,
              }),
            ),
            render: (categories: DueCategory[]) => (
              <Space separator={<Divider vertical />} size="small">
                {categories.map((category) => (
                  <DueCategoryIconLabel category={category} key={category} />
                ))}
              </Space>
            ),
            title: 'Categorías',
            width: 300,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'receiptNumber',
            render: (receiptNumber: null | string) => receiptNumber ?? '-',
            title: 'Recibo',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: labelMapToFilterOptions(PaymentStatusLabel),
            render: (value: PaymentStatus) => PaymentStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          ...(permissions.payments.listAll
            ? [
                {
                  align: 'center',
                  fixed: 'right',
                  render: (_, record) => (
                    <Space.Compact size="small">
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
                          onClick={() =>
                            setFilteredMemberIds([record.memberId])
                          }
                          tooltip="Filtrar por este socio"
                          type="text"
                        />
                      </Link>
                      <Link
                        to={{
                          pathname: appRoutes.dues.list,
                          search: new URLSearchParams({
                            filters: `memberId:${record.memberId}`,
                          }).toString(),
                        }}
                      >
                        <Button
                          icon={<DuesIcon />}
                          tooltip="Ver deudas"
                          type="text"
                        />
                      </Link>
                    </Space.Compact>
                  ),
                  title: 'Acciones',
                  width: TABLE_COLUMN_WIDTHS.ACTIONS,
                } satisfies TableColumnType<PaymentPaginatedDto>,
              ]
            : []),
        ]}
        dataSource={payments?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: payments?.total,
        }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell align="right" colSpan={1} index={0}>
                <TableSummaryTotalFilterText />
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={6} index={1}>
                {NumberFormat.currencyCents(payments?.extra?.totalAmount ?? 0)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
