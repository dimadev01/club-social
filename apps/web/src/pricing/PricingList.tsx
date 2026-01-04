import type { PaginatedDataResultDto } from '@club-social/shared/types';

import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  type MemberCategory,
  MemberCategoryLabel,
} from '@club-social/shared/members';
import { type IPricingPaginatedDto } from '@club-social/shared/pricing';
import { keepPreviousData } from '@tanstack/react-query';
import { Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { DueCategoryIconLabel } from '@/dues/DueCategoryIconLabel';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToFilterOptions } from '@/shared/lib/utils';
import {
  Card,
  NotFound,
  PageTableActions,
  Table,
  TABLE_COLUMN_WIDTHS,
  TableActions,
  useTable,
} from '@/ui';
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
      $fetch<PaginatedDataResultDto<IPricingPaginatedDto>>(
        '/pricing/paginated',
        {
          query,
        },
      ),
  });

  if (!permissions.pricing.list) {
    return <NotFound />;
  }

  return (
    <Card
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
      title="Precios"
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
            title: 'Desde',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            dataIndex: 'effectiveTo',
            render: (effectiveTo: null | string) =>
              effectiveTo ? DateFormat.date(effectiveTo) : '-',
            title: 'Hasta',
            width: TABLE_COLUMN_WIDTHS.DATE,
          },
          {
            align: 'center',
            dataIndex: 'dueCategory',
            filteredValue: getFilterValue('dueCategory'),
            filters: labelMapToFilterOptions(DueCategoryLabel).map(
              ({ value }) => ({
                text: <DueCategoryIconLabel category={value as DueCategory} />,
                value,
              }),
            ),
            render: (value: DueCategory) => DueCategoryLabel[value],
            title: 'Categoría de Deuda',
            width: TABLE_COLUMN_WIDTHS.DUE_CATEGORY,
          },
          {
            align: 'center',
            dataIndex: 'memberCategory',
            filteredValue: getFilterValue('memberCategory'),
            filterMode: 'tree',
            filters: labelMapToFilterOptions(MemberCategoryLabel),
            render: (memberCategory: MemberCategory) =>
              MemberCategoryLabel[memberCategory],
            title: 'Categoría de Socio',
            width: TABLE_COLUMN_WIDTHS.DUE_CATEGORY,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => NumberFormat.currencyCents(amount),
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
    </Card>
  );
}
