import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
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
  MemberLedgerEntryTypeSorted,
} from '@club-social/shared/members';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useExport } from '@/shared/hooks/useExport';
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
  } = useTable<MemberLedgerEntryPaginatedDto>({
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const { exportData, isExporting } = useExport({
    endpoint: '/member-ledger/export',
    filename: `libro-mayor-${DateFormat.isoDate(new Date())}.csv`,
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
    <Page
      extra={
        <Space.Compact>
          {permissions.memberLedger.create && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => navigate(appRoutes.memberLedger.new)}
              type="primary"
            >
              Nuevo ajuste
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
      title="Libro mayor de socios"
    >
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
            width: TABLE_COLUMN_WIDTHS.DATE_TIME,
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
            filters: MemberLedgerEntryTypeSorted.map(({ label, value }) => ({
              text: label,
              value,
            })),
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
                colSpan={7}
                index={0}
                rowSpan={2}
              >
                Balance
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" colSpan={1} index={1}>
                {NumberFormat.formatCurrencyCents(entries?.extra?.balance ?? 0)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </Page>
  );
}
