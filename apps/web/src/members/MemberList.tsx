import { MoreOutlined } from '@ant-design/icons';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MemberCategory,
  MemberCategoryLabel,
  type MemberPaginatedDto,
  MemberStatus,
  MemberStatusLabel,
} from '@club-social/shared/members';
import { type PaginatedDataResultDto } from '@club-social/shared/types';
import { keepPreviousData } from '@tanstack/react-query';
import { Dropdown, Space, Typography } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import {
  Button,
  Card,
  DuesIcon,
  LedgerIcon,
  NavigateToMember,
  NotFound,
  PageTableActions,
  PaymentsIcon,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  TableMembersSearch,
  useTable,
} from '@/ui';
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
      $fetch<PaginatedDataResultDto<MemberPaginatedDto>>('/members/paginated', {
        query,
      }),
  });

  if (!permissions.members.list) {
    return <NotFound />;
  }

  return (
    <Card
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
                <NavigateToMember id={id}>{record.name}</NavigateToMember>
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
            dataIndex: 'email',
            render: (text) => (
              <Typography.Text copyable={{ text }}>{text}</Typography.Text>
            ),
            sorter: true,
            sortOrder: getSortOrder('email'),
            title: 'Email',
          },
          {
            align: 'center',
            dataIndex: 'status',
            render: (status: MemberStatus) => MemberStatusLabel[status],
            sorter: true,
            sortOrder: getSortOrder('status'),
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.STATUS,
          },
          {
            align: 'right',
            dataIndex: 'memberShipTotalDueAmount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('memberShipTotalDueAmount'),
            title: 'Deuda cuota',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'electricityTotalDueAmount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('electricityTotalDueAmount'),
            title: 'Deuda luz',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'guestTotalDueAmount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('guestTotalDueAmount'),
            title: 'Deuda invitado',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'totalAmount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('totalAmount'),
            title: 'Deuda total',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'balance',
            render: (amount: number) => NumberFormat.currencyCents(amount),
            sorter: true,
            sortOrder: getSortOrder('balance'),
            title: 'Saldo',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Link
                  to={{
                    pathname: appRoutes.dues.list,
                    search: new URLSearchParams({
                      filters: `memberId:${record.id}`,
                    }).toString(),
                  }}
                >
                  <Button
                    icon={<DuesIcon />}
                    tooltip="Ver deudas"
                    type="text"
                  />
                </Link>
                <Link
                  to={{
                    pathname: appRoutes.payments.list,
                    search: new URLSearchParams({
                      filters: `memberId:${record.id}`,
                    }).toString(),
                  }}
                >
                  <Button
                    icon={<PaymentsIcon />}
                    tooltip="Ver pagos"
                    type="text"
                  />
                </Link>
                <Link
                  to={{
                    pathname: appRoutes.memberLedger.list,
                    search: new URLSearchParams({
                      filters: `memberId:${record.id}`,
                    }).toString(),
                  }}
                >
                  <Button
                    icon={<LedgerIcon />}
                    tooltip="Ver libro mayor"
                    type="text"
                  />
                </Link>
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
      />
    </Card>
  );
}
