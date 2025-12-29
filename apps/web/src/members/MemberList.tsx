import { MoreOutlined } from '@ant-design/icons';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import {
  MemberCategory,
  MemberCategoryLabel,
  type MemberPaginatedDto,
  type MemberPaginatedExtraDto,
  MemberStatus,
  MemberStatusLabel,
} from '@club-social/shared/members';
import { type PaginatedDataResultDto } from '@club-social/shared/types';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Dropdown, Space, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import { DuesIcon } from '@/ui/Icons/DuesIcon';
import { LedgerIcon } from '@/ui/Icons/LedgerIcon';
import { PaymentsIcon } from '@/ui/Icons/PaymentsIcon';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableMembersSearch } from '@/ui/Table/TableMembersSearch';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

import { useMembersForSelect } from './useMembersForSelect';

export function MemberListPage() {
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
  } = useTable<MemberPaginatedDto>({
    defaultFilters: {
      status: [MemberStatus.ACTIVE],
    },
    defaultSort: [{ field: 'id', order: 'ascend' }],
  });

  const [initialMemberIds] = useState(getFilterValue('id') ?? []);

  const { exportData, isExporting } = useExport({
    endpoint: '/members/export',
    filename: `socios-${DateFormat.isoDate(new Date())}.csv`,
  });

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: initialMemberIds });

  const { data: members, isLoading } = useQuery({
    ...queryKeys.members.paginated(query),
    enabled: permissions.members.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<
        PaginatedDataResultDto<MemberPaginatedDto, MemberPaginatedExtraDto>
      >('/members/paginated', {
        query,
      }),
  });

  if (!permissions.members.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          <Button
            disabled={!permissions.members.create}
            onClick={() => navigate(appRoutes.members.new)}
            type="primary"
          >
            Nuevo socio
          </Button>
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
            <Button icon={<MoreOutlined />} loading={isExporting} />
          </Dropdown>
        </Space.Compact>
      }
      title="Socios"
    >
      <PageTableActions>
        <TableMembersSearch
          isLoading={isSelectedMembersLoading}
          onFilterChange={(value) => setFilter('id', value ?? [])}
          selectedMembers={selectedMembers}
          value={getFilterValue('id') ?? undefined}
        />

        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<MemberPaginatedDto>
        columns={[
          {
            dataIndex: 'id',
            fixed: 'left',
            render: (id, record) => (
              <Typography.Text className="line-clamp-1 w-full">
                <Link to={appRoutes.members.view(id)}>{record.name}</Link>
              </Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('id'),
            title: 'Socio',
          },
          {
            align: 'center',
            dataIndex: 'category',
            filteredValue: getFilterValue('category'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(MemberCategoryLabel),
            render: (value: MemberCategory) => MemberCategoryLabel[value],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filters: Object.entries(MemberStatusLabel).map(
              ([value, label]) => ({ text: label, value }),
            ),
            onFilter: (value, record) => record.status === value,
            render: (value: MemberStatus) => MemberStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            dataIndex: 'email',
            render: (text) => (
              <Typography.Text copyable={{ text }}>{text}</Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('email'),
            title: 'Email',
          },
          {
            align: 'right',
            dataIndex: 'memberShipTotalDueAmount',
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('memberShipTotalDueAmount'),
            title: 'Deuda cuota',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'electricityTotalDueAmount',
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('electricityTotalDueAmount'),
            title: 'Deuda luz',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'guestTotalDueAmount',
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('guestTotalDueAmount'),
            title: 'Deuda invitado',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Tooltip title="Ver deudas">
                  <Link
                    to={{
                      pathname: appRoutes.dues.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.id}`,
                      }).toString(),
                    }}
                  >
                    <Button icon={<DuesIcon />} type="text" />
                  </Link>
                </Tooltip>
                <Tooltip title="Ver pagos">
                  <Link
                    to={{
                      pathname: appRoutes.payments.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.id}`,
                      }).toString(),
                    }}
                  >
                    <Button icon={<PaymentsIcon />} type="text" />
                  </Link>
                </Tooltip>
                <Tooltip title="Ver libro mayor">
                  <Link
                    to={{
                      pathname: appRoutes.memberLedger.list,
                      search: new URLSearchParams({
                        filters: `memberId:${record.id}`,
                      }).toString(),
                    }}
                  >
                    <Button icon={<LedgerIcon />} type="text" />
                  </Link>
                </Tooltip>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: TABLE_COLUMN_WIDTHS.ACTIONS,
          },
        ]}
        dataSource={members?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: members?.total,
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell align="right" colSpan={4} index={0}>
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell align="right" colSpan={1} index={1}>
              {NumberFormat.formatCurrencyCents(
                members?.extra?.memberShipTotalDueAmount ?? 0,
              )}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="right" colSpan={1} index={2}>
              {NumberFormat.formatCurrencyCents(
                members?.extra?.electricityTotalDueAmount ?? 0,
              )}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="right" colSpan={1} index={3}>
              {NumberFormat.formatCurrencyCents(
                members?.extra?.guestTotalDueAmount ?? 0,
              )}
            </Table.Summary.Cell>
            <Table.Summary.Cell colSpan={1} index={4} />
          </Table.Summary.Row>
        )}
      />
    </Page>
  );
}
