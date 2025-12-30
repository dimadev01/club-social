import type { PaginatedDataResultDto } from '@club-social/shared/types';

import {
  AuditAction,
  AuditActionLabel,
  AuditEntity,
  AuditEntityLabel,
  type AuditLogPaginatedDto,
} from '@club-social/shared/audit-logs';
import { DateFormat } from '@club-social/shared/lib';
import { keepPreviousData } from '@tanstack/react-query';
import { Col, Tag, Typography } from 'antd';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { Descriptions } from '@/ui/Descriptions';
import { NotFound } from '@/ui/NotFound';
import { Page, PageTableActions } from '@/ui/Page';
import { Row } from '@/ui/Row';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';
import { TableActions } from '@/ui/Table/TableActions';
import { TableDateRangeFilterDropdown } from '@/ui/Table/TableDateRangeFilterDropdown';
import { useTable } from '@/ui/Table/useTable';
import { usePermissions } from '@/users/use-permissions';

export function AuditLogsList() {
  const permissions = usePermissions();

  const {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    state,
  } = useTable<AuditLogPaginatedDto>({
    defaultSort: [{ field: 'createdAt', order: 'descend' }],
  });

  const { data: auditLogs, isLoading } = useQuery({
    ...queryKeys.movements.paginated(query),
    enabled: permissions.auditLogs.list,
    placeholderData: keepPreviousData,
    queryFn: () =>
      $fetch<PaginatedDataResultDto<AuditLogPaginatedDto>>(
        '/audit-logs/paginated',
        {
          query,
        },
      ),
  });

  if (!permissions.auditLogs.list) {
    return <NotFound />;
  }

  return (
    <Page title="Auditoría">
      <PageTableActions justify="end">
        <TableActions clearFilters={clearFilters} resetFilters={resetFilters} />
      </PageTableActions>

      <Table<AuditLogPaginatedDto>
        columns={[
          {
            dataIndex: 'createdAt',
            filterDropdown: (props) => (
              <TableDateRangeFilterDropdown {...props} format="datetime" />
            ),
            filteredValue: getFilterValue('createdAt'),
            render: (createdAt: string) => DateFormat.dateTime(createdAt),
            sorter: true,
            sortOrder: getSortOrder('createdAt'),
            title: 'Creado el',
            width: TABLE_COLUMN_WIDTHS.DATE_TIME,
          },
          {
            dataIndex: 'createdBy',
            render: (createdBy: string) => createdBy,
            title: 'Creado por',
          },
          {
            align: 'center',
            dataIndex: 'entity',
            filteredValue: getFilterValue('entity'),
            filterMode: 'tree',
            filters: Object.entries(AuditEntityLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (entity: AuditEntity) => AuditEntityLabel[entity],
            title: 'Entidad',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'center',
            dataIndex: 'action',
            filteredValue: getFilterValue('action'),
            filterMode: 'tree',
            filters: Object.entries(AuditActionLabel).map(([value, label]) => ({
              text: label,
              value,
            })),
            render: (action: AuditAction) => AuditActionLabel[action],
            title: 'Acción',
            width: TABLE_COLUMN_WIDTHS.ACTIONS,
          },
          {
            dataIndex: 'id',
            render: (id: string) => (
              <Typography.Text copyable={{ text: id }}>{id}</Typography.Text>
            ),
            title: 'ID',
          },
        ]}
        dataSource={auditLogs?.data}
        expandable={{
          expandedRowRender: (record) => (
            <Row>
              <Col md={12} xs={24}>
                <Descriptions
                  bordered
                  column={1}
                  items={Object.entries(record.oldData ?? {}).map(
                    ([key, value]) => ({
                      children:
                        typeof value === 'object' && value !== null
                          ? JSON.stringify(value, null, 2)
                          : String(value ?? '-'),
                      label: key,
                    }),
                  )}
                  title="Datos antiguos"
                />
              </Col>
              <Col md={12} xs={24}>
                <Descriptions
                  bordered
                  column={1}
                  items={Object.entries(record.newData ?? {}).map(
                    ([key, value]) => {
                      const oldData = String(record.oldData?.[key] ?? '-');
                      const newData = String(value ?? '-');

                      if (record.oldData && oldData !== newData) {
                        return {
                          children: <Tag color="green">{newData}</Tag>,
                          key,
                          label: key,
                        };
                      }

                      return {
                        children: newData,
                        key,
                        label: key,
                      };
                    },
                  )}
                  title="Datos nuevos"
                />
              </Col>
            </Row>
          ),
        }}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: auditLogs?.total,
        }}
      />
    </Page>
  );
}
