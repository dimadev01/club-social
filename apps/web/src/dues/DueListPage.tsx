import type { PaginatedResponse } from '@club-social/shared/types';

import {
  FileExcelOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  type DueCategory,
  DueCategoryLabel,
  type DueDto,
  type DueStatus,
  DueStatusLabel,
} from '@club-social/shared/dues';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Dropdown, Space, Tag, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { $fetch } from '@/shared/lib/fetch';
import { useQuery } from '@/shared/lib/useQuery';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { Table } from '@/ui/Table/Table';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

const formatAmount = (amountInCents: number) => {
  return new Intl.NumberFormat('es-AR', {
    currency: 'ARS',
    style: 'currency',
  }).format(amountInCents / 100);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

const statusColor: Record<DueStatus, string> = {
  paid: 'success',
  'partially-paid': 'warning',
  pending: 'default',
  voided: 'error',
};

export function DueListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const permissions = usePermissions();

  const { onChange, status } = useTable<DueDto>();

  const duesQuery = useQuery({
    enabled: permissions.dues.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedResponse<DueDto>>('/dues/paginated', {
        query: {
          page: status.page,
          pageSize: status.pageSize,
          ...status.sortSerialized,
        },
      }),
    queryKey: ['dues', status],
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
      <Table<DueDto>
        dataSource={duesQuery.data?.data}
        loading={duesQuery.isFetching}
        onChange={onChange}
        pagination={{
          current: status.page,
          pageSize: status.pageSize,
          total: duesQuery.data?.total,
        }}
      >
        <Table.Column<DueDto>
          dataIndex="id"
          render={(id: string, record) => (
            <Link to={`${APP_ROUTES.DUE_LIST}/${id}`}>
              {formatDate(record.date)}
            </Link>
          )}
          title="Fecha"
        />
        <Table.Column<DueDto>
          align="center"
          dataIndex="category"
          render={(value: DueCategory) => DueCategoryLabel[value]}
          title="Categoría"
        />
        <Table.Column<DueDto>
          align="right"
          dataIndex="amount"
          render={(amount: number) => formatAmount(amount)}
          title="Monto"
        />
        <Table.Column<DueDto>
          align="center"
          dataIndex="status"
          render={(value: DueStatus) => (
            <Tag color={statusColor[value]}>{DueStatusLabel[value]}</Tag>
          )}
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
