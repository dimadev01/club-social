import type { PaginatedResponse } from '@club-social/shared/types';

import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  type IMemberLedgerEntryPaginatedDto,
  type IMemberLedgerEntryPaginatedExtraDto,
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatus,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryType,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

// Types that represent negative amounts (debits)
const DEBIT_TYPES: string[] = [
  MemberLedgerEntryType.DUE_APPLY_DEBIT,
  MemberLedgerEntryType.BALANCE_APPLY_DEBIT,
  MemberLedgerEntryType.REFUND_DEBIT,
  MemberLedgerEntryType.ADJUSTMENT_DEBIT,
];

// Types that represent positive amounts (credits)
const CREDIT_TYPES: string[] = [
  MemberLedgerEntryType.DEPOSIT_CREDIT,
  MemberLedgerEntryType.ADJUSTMENT_CREDIT,
];

export function MemberLedgerList() {
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
  } = useTable<IMemberLedgerEntryPaginatedDto>({
    defaultFilters: {
      status: [MemberLedgerEntryStatus.POSTED],
    },
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const [filteredMemberIds] = useState(getFilterValue('memberId') ?? []);

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const { data: entries, isLoading } = useQuery({
    ...queryKeys.memberLedger.paginated(query),
    enabled: permissions.memberLedger.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<
        PaginatedResponse<
          IMemberLedgerEntryPaginatedDto,
          IMemberLedgerEntryPaginatedExtraDto
        >
      >('/member-ledger', { query }),
  });

  if (!permissions.memberLedger.list) {
    return <NotFound />;
  }

  return (
    <Page title="Libro mayor de socios">
      <PageTableActions justify="end">
        {permissions.memberLedger.listAll && (
          <TableMembersSearch
            isLoading={isSelectedMembersLoading}
            onFilterChange={(value) => setFilter('memberId', value)}
            selectedMembers={selectedMembers}
            value={getFilterValue('memberId') ?? undefined}
          />
        )}
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IMemberLedgerEntryPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            render: (createdAt: string, record) => (
              <Link to={appRoutes.memberLedger.view(record.id)}>
                {DateFormat.dateTime(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),
            filteredValue: getFilterValue('date'),
            render: (date: string) => DateFormat.date(date),
            title: 'Fecha',
          },
          {
            dataIndex: 'memberFullName',
            render: (memberFullName: string, record) => (
              <Link to={appRoutes.members.view(record.memberId)}>
                {memberFullName}
              </Link>
            ),
            title: 'Socio',
            width: 200,
          },
          {
            align: 'center',
            dataIndex: 'type',
            filteredValue: getFilterValue('type'),
            filterMode: 'tree',
            filters: Object.entries(MemberLedgerEntryTypeLabel).map(
              ([value, label]) => ({
                text: label,
                value,
              }),
            ),
            render: (value: MemberLedgerEntryType) =>
              MemberLedgerEntryTypeLabel[value],
            title: 'Tipo',
            width: 160,
          },
          {
            align: 'center',
            dataIndex: 'source',
            filteredValue: getFilterValue('source'),
            filters: Object.entries(MemberLedgerEntrySourceLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            render: (value: keyof typeof MemberLedgerEntrySourceLabel) =>
              MemberLedgerEntrySourceLabel[value],
            title: 'Origen',
            width: 100,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: Object.entries(MemberLedgerEntryStatusLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            render: (value: keyof typeof MemberLedgerEntryStatusLabel) =>
              MemberLedgerEntryStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: 'paymentId',
            render: (paymentId: null | string) =>
              paymentId ? (
                <Link to={appRoutes.payments.view(paymentId)}>Ver pago</Link>
              ) : (
                '-'
              ),
            title: 'Pago',
            width: 100,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number, record: IMemberLedgerEntryPaginatedDto) =>
              DEBIT_TYPES.includes(record.type)
                ? NumberFormat.formatCurrencyCents(amount)
                : '',
            title: 'Egresos',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number, record: IMemberLedgerEntryPaginatedDto) =>
              CREDIT_TYPES.includes(record.type)
                ? NumberFormat.formatCurrencyCents(amount)
                : '',
            title: 'Ingresos',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
        ]}
        dataSource={entries?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: entries?.total,
        }}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell
                align="right"
                colSpan={7}
                index={0}
                rowSpan={2}
              >
                Totales
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={1}>
                {NumberFormat.formatCurrencyCents(
                  entries?.extra?.totalAmountOutflow ?? 0,
                )}
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={2}>
                {NumberFormat.formatCurrencyCents(
                  entries?.extra?.totalAmountInflow ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell align="center" colSpan={2} index={1}>
                {NumberFormat.formatCurrencyCents(
                  entries?.extra?.totalAmount ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </Page>
  );
}
