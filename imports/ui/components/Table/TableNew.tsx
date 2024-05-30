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
} from '@infra/controllers/types/get-grid-request.dto';

export interface TableState<T> {
  filters: Record<string, FilterValue | null>;
  pagination: TablePaginationConfig;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface Props<T> extends TableProps<T> {
  setGridState: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  state: GridState;
  total: number;
}

export interface GridState {
  filters: GridFilter | null;
  page: number;
  pageSize: number;
  search: string | null;
  sorter: GridSorter;
}

export function TableNew<T extends object>({
  rowKey = '_id',
  state,
  setGridState,
  total,
  ...rest
}: Props<T>): JSX.Element {
  return (
    <AntTable<T>
      bordered
      size="small"
      onChange={(
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<T> | SorterResult<T>[],
      ) => setGridState(pagination, filters, sorter)}
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
      className="rxs-table"
      rowKey={rowKey}
      scroll={{ x: true }}
      {...rest}
    />
  );
}
