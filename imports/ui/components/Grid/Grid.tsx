import { Table as AntTable, TableProps } from 'antd';
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import React from 'react';

import {
  GridFilter,
  GridSorter,
} from '@adapters/common/dtos/get-grid-request.dto';

export interface TableState<T> {
  filters: Record<string, FilterValue | null>;
  pagination: TablePaginationConfig;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface Props<T> extends TableProps<T> {
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  state: GridState;
  total?: number;
}

export interface GridState {
  filters: GridFilter;
  page: number;
  pageSize: number;
  sorter: GridSorter;
}

export function Grid<T extends object>({
  rowKey = 'id',
  state,
  onTableChange,
  total,
  columns,
  expandable,
  ...rest
}: Props<T>): JSX.Element {
  const columnsWidth =
    columns?.reduce((acc, column) => acc + Number(column.width ?? 0), 0) ?? 0;

  return (
    <AntTable<T>
      bordered
      size="small"
      columns={columns}
      onChange={(
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<T> | SorterResult<T>[],
      ) => onTableChange(pagination, filters, sorter)}
      pagination={{
        current: state.page,
        hideOnSinglePage: false,
        pageSize: state.pageSize,
        pageSizeOptions: ['10', '25', '50', '100', '250'],
        showSizeChanger: true,
        showTotal: (totalCount: number, range: [number, number]) =>
          `${range[0]}-${range[1]} of ${totalCount} items`,
        size: 'small',
        total,
      }}
      rowKey={rowKey}
      scroll={{
        scrollToFirstRowOnChange: true,
        x: columnsWidth,
        y: 600,
      }}
      expandable={{ ...expandable, columnWidth: 32 }}
      {...rest}
    />
  );
}
