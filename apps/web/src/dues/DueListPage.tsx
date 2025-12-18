import type { PaginatedResponse } from '@club-social/shared/types';

import {
  CloseOutlined,
  FileExcelOutlined,
  MoreOutlined,
  PlusOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import {
  type DueCategory,
  DueCategoryLabel,
  type DueDto,
  type DueStatus,
  DueStatusLabel,
} from '@club-social/shared/dues';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Flex, Space, Tooltip, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function DueListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    state,
  } = useTable<DueDto>({ defaultSort: [{ field: 'date', order: 'descend' }] });

  const duesQuery = useQuery({
    enabled: permissions.dues.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<DueDto>>('/dues/paginated', { query }),
    queryKey: ['dues', state, query],
  });

  if (duesQuery.error) {
    message.error(duesQuery.error.message);
  }

  if (!permissions.dues.list) {
    return <NotFound />;
  }

  return (
    <Page
      extra={
        <Space.Compact>
          {permissions.dues.create && (
            <Button
              disabled={!permissions.dues.create}
              icon={<PlusOutlined />}
              onClick={() => navigate(APP_ROUTES.DUE_NEW)}
              type="primary"
            >
              Nueva deuda
            </Button>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  icon: <FileExcelOutlined />,
                  key: 'export',
                  label: 'Exportar',
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space.Compact>
      }
      title="Cuotas"
    >
      <Flex className="mb-4" justify="end">
        <Space.Compact>
          <Tooltip title="Filtros por defecto">
            <Button
              icon={<RedoOutlined />}
              onClick={resetFilters}
              type="default"
            />
          </Tooltip>
          <Tooltip title="Eliminar filtros">
            <Button
              icon={<CloseOutlined />}
              onClick={clearFilters}
              type="default"
            />
          </Tooltip>
        </Space.Compact>
      </Flex>
      <Table<DueDto>
        dataSource={duesQuery.data?.data}
        loading={duesQuery.isFetching}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: duesQuery.data?.total,
        }}
      >
        <Table.Column<DueDto>
          dataIndex="createdAt"
          render={(createdAt: string, record) => (
            <Link to={`${APP_ROUTES.DUE_LIST}/${record.id}`}>
              {DateFormat.date(createdAt)}
            </Link>
          )}
          sorter
          sortOrder={getSortOrder('createdAt')}
          title="Fecha de creación"
        />
        <Table.Column<DueDto>
          dataIndex="date"
          sorter
          sortOrder={getSortOrder('date')}
          title="Fecha"
        />
        <Table.Column<DueDto>
          align="center"
          dataIndex="category"
          filteredValue={getFilterValue('category')}
          filters={Object.entries(DueCategoryLabel).map(([value, label]) => ({
            text: label,
            value,
          }))}
          onFilter={(value, record) => record.category === value}
          render={(value: DueCategory) => DueCategoryLabel[value]}
          title="Categoría"
        />
        <Table.Column<DueDto>
          align="right"
          dataIndex="amount"
          render={(amount: number) => NumberFormat.formatCents(amount)}
          title="Monto"
        />
        <Table.Column<DueDto>
          align="center"
          dataIndex="status"
          filteredValue={getFilterValue('status')}
          filters={Object.entries(DueStatusLabel).map(([value, label]) => ({
            text: label,
            value,
          }))}
          render={(value: DueStatus) => DueStatusLabel[value]}
          title="Estado"
        />
        <Table.Column<DueDto>
          dataIndex="memberId"
          render={(memberId: string) => (
            <Typography.Text copyable={{ text: memberId }}>
              <Link to={`${APP_ROUTES.MEMBER_LIST}/${memberId}`}>
                {memberId.slice(0, 8)}...
              </Link>
            </Typography.Text>
          )}
          title="Socio"
        />
        <Table.Column<DueDto>
          dataIndex="notes"
          render={(notes: null | string) => notes ?? '-'}
          title="Notas"
        />
      </Table>
    </Page>
  );
}
