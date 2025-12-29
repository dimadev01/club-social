import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  type MemberLedgerEntryPaginatedDto,
  type MemberLedgerEntryPaginatedExtraDto,
  MemberLedgerEntrySource,
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
import { NavigateToMember } from '@/ui/NavigateMember';
import { NavigateToPayment } from '@/ui/NavigateToPayment';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

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
  } = useTable<MemberLedgerEntryPaginatedDto>({
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
        PaginatedDataResultDto<
          MemberLedgerEntryPaginatedDto,
          MemberLedgerEntryPaginatedExtraDto
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

      <Table<MemberLedgerEntryPaginatedDto>
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
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            dataIndex: 'memberFullName',
            render: (memberFullName: string, record) => (
              <NavigateToMember id={record.memberId}>
                {memberFullName}
              </NavigateToMember>
            ),
            title: 'Socio',
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
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: 'source',
            filteredValue: getFilterValue('source'),
            filters: Object.entries(MemberLedgerEntrySourceLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            render: (
              value: MemberLedgerEntrySource,
              record: MemberLedgerEntryPaginatedDto,
            ) => (
              <>
                {MemberLedgerEntrySourceLabel[value]}
                {value === MemberLedgerEntrySource.PAYMENT &&
                  record.paymentId && (
                    <>
                      {' - '}
                      <NavigateToPayment
                        formatDate={false}
                        id={record.paymentId}
                      >
                        Ver pago
                      </NavigateToPayment>
                    </>
                  )}
              </>
            ),
            title: 'Origen',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: Object.entries(MemberLedgerEntryStatusLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            render: (value: MemberLedgerEntryStatus) =>
              MemberLedgerEntryStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount < 0 ? NumberFormat.formatCurrencyCents(amount) : '',
            title: 'Egresos',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount > 0 ? NumberFormat.formatCurrencyCents(amount) : '',
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
                colSpan={6}
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
