import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { FilterOutlined, MoreOutlined } from '@ant-design/icons';
import {
  type DueCategory,
  DueCategoryLabel,
  type DuePaginatedDto,
  type DuePaginatedExtraDto,
  DueStatus,
  DueStatusLabel,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import { MemberStatus, MemberStatusLabel } from '@club-social/shared/members';
import { keepPreviousData } from '@tanstack/react-query';
import { Dropdown, Space, type TableColumnType } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMembersForSelect } from '@/members/useMembersForSelect';
import { useExport } from '@/shared/hooks/useExport';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import {
  Button,
  Card,
  NotFound,
  PageTableActions,
  PaymentsIcon,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  TableDateRangeFilterDropdown,
  TableMembersSearch,
  useTable,
} from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { DueCategoryIconLabel } from './DueCategoryIconLabel';

export function DueList() {
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
  } = useTable<DuePaginatedDto>({
    defaultFilters: {
      status: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
    },
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const { exportData, isExporting } = useExport({
    endpoint: '/dues/export',
    filename: `deudas-${DateFormat.isoDate(new Date())}.csv`,
  });

  const [filteredMemberIds, setFilteredMemberIds] = useState(
    getFilterValue('memberId') ?? [],
  );

  const { data: selectedMembers, isLoading: isSelectedMembersLoading } =
    useMembersForSelect({ memberIds: filteredMemberIds });

  const { data: dues, isLoading } = useQuery({
    ...queryKeys.dues.paginated(query),
    enabled: permissions.dues.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedDataResultDto<DuePaginatedDto, DuePaginatedExtraDto>>(
        '/dues/paginated',
        { query },
      ),
  });

  if (!permissions.dues.list) {
    return <NotFound />;
  }

  return (
    <Card
      extra={
        <Space.Compact>
          {permissions.dues.create && (
            <Button
              disabled={!permissions.dues.create}
              onClick={() => navigate(appRoutes.dues.new)}
              type="primary"
            >
              Nueva deuda
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
      title="Deudas"
    >
      <PageTableActions>
        {permissions.dues.listAll && (
          <TableMembersSearch
            isLoading={isSelectedMembersLoading}
            onFilterChange={(value) => setFilter('memberId', value)}
            selectedMembers={selectedMembers}
            value={getFilterValue('memberId') ?? undefined}
          />
        )}

        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<DuePaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            fixed: 'left',
            render: (createdAt: string, record) => (
              <Link to={appRoutes.dues.view(record.id)}>
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
          ...(permissions.dues.listAll
            ? [
                {
                  dataIndex: 'memberId',
                  render: (memberId: string, record: DuePaginatedDto) => (
                    <Link to={appRoutes.members.view(memberId)}>
                      {record.memberName}
                    </Link>
                  ),
                  title: 'Socio',
                } satisfies TableColumnType<DuePaginatedDto>,
              ]
            : []),
          {
            align: 'center',
            dataIndex: 'category',
            filteredValue: getFilterValue('category'),
            filters: labelMapToFilterOptions(DueCategoryLabel).map(
              ({ value }) => ({
                text: <DueCategoryIconLabel category={value as DueCategory} />,
                value,
              }),
            ),
            render: (value: DueCategory, record) => (
              <DueCategoryIconLabel category={value} date={record.date} />
            ),
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.DUE_CATEGORY,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            dataIndex: 'status',
            filteredValue: getFilterValue('status'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(DueStatusLabel),
            render: (value: DueStatus) => DueStatusLabel[value],
            title: 'Estado',
            width: TABLE_COLUMN_WIDTHS.DUE_STATUS,
          },
          ...(permissions.dues.listAll
            ? [
                {
                  align: 'center',
                  dataIndex: 'memberStatus',
                  filteredValue: getFilterValue('memberStatus'),
                  filters: labelMapToFilterOptions(MemberStatusLabel),
                  render: (value: MemberStatus) => MemberStatusLabel[value],
                  title: 'Estado Socio',
                  width: TABLE_COLUMN_WIDTHS.STATUS,
                } satisfies TableColumnType<DuePaginatedDto>,
                {
                  align: 'center',
                  fixed: 'right',
                  render: (_, record) => (
                    <Space.Compact size="small">
                      <Link
                        to={{
                          pathname: appRoutes.dues.list,
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
                        to={`${appRoutes.payments.new}?memberId=${record.memberId}`}
                      >
                        <Button
                          disabled={record.status === DueStatus.PAID}
                          icon={<PaymentsIcon />}
                          onClick={() =>
                            setFilteredMemberIds([record.memberId])
                          }
                          tooltip="Nuevo pago"
                          type="text"
                        />
                      </Link>
                    </Space.Compact>
                  ),
                  title: 'Acciones',
                  width: TABLE_COLUMN_WIDTHS.ACTIONS,
                } satisfies TableColumnType<DuePaginatedDto>,
              ]
            : []),
        ]}
        dataSource={dues?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: dues?.total,
        }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell align="right" colSpan={1} index={0}>
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={7} index={1}>
                {NumberFormat.formatCurrencyCents(
                  dues?.extra?.totalAmount ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
