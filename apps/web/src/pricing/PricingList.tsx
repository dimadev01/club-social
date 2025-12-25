import type { PaginatedResponse } from '@club-social/shared/types';

import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import {
  type MemberCategory,
  MemberCategoryLabel,
  MemberCategoryOptions,
} from '@club-social/shared/members';
import { type IPricingPaginatedDto } from '@club-social/shared/pricing';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function PricingList() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    state,
  } = useTable<IPricingPaginatedDto>({
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const { data: pricing, isLoading } = useQuery({
    ...queryKeys.pricing.paginated(query),
    enabled: permissions.pricing.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<IPricingPaginatedDto>>('/pricing/paginated', {
        query,
      }),
  });

  if (!permissions.pricing.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          {permissions.pricing.create && (
            <Button
              disabled={!permissions.pricing.create}
              onClick={() => navigate(appRoutes.pricing.new)}
              type="primary"
            >
              Nuevo precio
            </Button>
          )}
        </Space.Compact>
      }
      title="Deudas"
    >
      <PageTableActions>
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<IPricingPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            fixed: 'left',
            render: (createdAt: string, record) => (
              <Link to={appRoutes.pricing.view(record.id)}>
                {DateFormat.dateTime(createdAt)}
              </Link>
            ),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
          },
          {
            dataIndex: 'effectiveFrom',
            render: (effectiveFrom: string) => DateFormat.date(effectiveFrom),
            title: 'Vigente desde',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            dataIndex: 'effectiveTo',
            render: (effectiveTo: null | string) =>
              effectiveTo ? DateFormat.date(effectiveTo) : '-',
            title: 'Vigente hasta',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            align: 'center',
            dataIndex: 'dueCategory',
            filteredValue: getFilterValue('dueCategory'),
            filters: Object.entries(DueCategoryLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (value: DueCategory) => DueCategoryLabel[value],
            title: 'Tipo de deuda',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'center',
            dataIndex: 'memberCategory',
            filteredValue: getFilterValue('memberCategory'),
            filterMode: 'tree',
            filters: MemberCategoryOptions.map(({ label, value }) => ({
              text: label,
              value,
            })),
            render: (memberCategory: MemberCategory) =>
              MemberCategoryLabel[memberCategory],
            title: 'Categoría de socio',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) =>
              NumberFormat.formatCurrencyCents(amount),
            title: 'Monto',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
        ]}
        dataSource={pricing?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: pricing?.total,
        }}
      />
    </Page>
  );
}
