import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  type MemberLedgerEntryPaginatedDto,
  type MemberLedgerEntryPaginatedExtraDto,
  MemberLedgerEntrySource,
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryType,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Flex, Space, type TableColumnType } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  labelMapToFilterOptions,
  labelMapToSelectOptions,
} from '@/shared/lib/utils';
import {
  Card,
  NavigateToMember,
  NavigateToMemberLedgerEntry,
  NavigateToPayment,
  NotFound,
  PageTableActions,
  Select,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  TableDateRangeFilterDropdown,
  TableMembersSearch,
  useTable,
} from '@/ui';
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
    defaultSort: [{ field: 'date', order: 'descend' }],
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
    <Card
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
        <Flex gap="middle" wrap>
          {permissions.memberLedger.listAll && (
            <TableMembersSearch
              isLoading={isSelectedMembersLoading}
              onFilterChange={(value) => setFilter('memberId', value)}
              selectedMembers={selectedMembers}
              value={getFilterValue('memberId') ?? undefined}
            />
          )}
          <Select
            className="min-w-full md:min-w-40"
            mode="multiple"
            onChange={(value) => setFilter('status', value)}
            options={labelMapToSelectOptions(MemberLedgerEntryStatusLabel)}
            placeholder="Filtrar por estado"
            value={getFilterValue('status') ?? undefined}
          />
        </Flex>
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<MemberLedgerEntryPaginatedDto>
        columns={[
          {
            align: 'left',
            dataIndex: 'date',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="date" />
            ),
            filteredValue: getFilterValue('date'),
            render: (createdAt: string, record) => (
              <NavigateToMemberLedgerEntry id={record.id}>
                {createdAt}
              </NavigateToMemberLedgerEntry>
            ),
            sorter: true,
            sortOrder: getSortOrder('date'),
            title: 'Fecha',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          ...(permissions.memberLedger.listAll
            ? [
                {
                  dataIndex: 'memberFullName',
                  render: (memberFullName: string, record) => (
                    <NavigateToMember id={record.memberId}>
                      {memberFullName}
                    </NavigateToMember>
                  ),
                  title: 'Socio',
                } satisfies TableColumnType<MemberLedgerEntryPaginatedDto>,
              ]
            : []),
          {
            align: 'center',
            dataIndex: 'type',
            filteredValue: getFilterValue('type'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(MemberLedgerEntryTypeLabel),
            render: (value: MemberLedgerEntryType) =>
              MemberLedgerEntryTypeLabel[value],
            title: 'Tipo',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'center',
            dataIndex: 'source',
            filteredValue: getFilterValue('source'),
            filters: labelMapToFilterOptions(MemberLedgerEntrySourceLabel),
            render: (
              value: MemberLedgerEntrySource,
              record: MemberLedgerEntryPaginatedDto,
            ) => {
              if (
                value === MemberLedgerEntrySource.PAYMENT &&
                record.paymentId
              ) {
                return (
                  <NavigateToPayment formatDate={false} id={record.paymentId}>
                    {MemberLedgerEntrySourceLabel[value]}
                  </NavigateToPayment>
                );
              }

              return MemberLedgerEntrySourceLabel[value];
            },
            title: 'Origen',
            width: TABLE_COLUMN_WIDTHS.ACTIONS,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount < 0 ? NumberFormat.currencyCents(Math.abs(amount)) : '',
            title: 'Egresos',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              amount > 0 ? NumberFormat.currencyCents(amount) : '',
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
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell align="right" colSpan={4} index={0}>
                Balance
              </Table.Summary.Cell>
              <Table.Summary.Cell align="center" colSpan={2} index={1}>
                {NumberFormat.currencyCents(entries?.extra?.balance ?? 0)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
