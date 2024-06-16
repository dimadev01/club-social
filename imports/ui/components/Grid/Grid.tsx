import { Table as AntTable, Flex, Space, TableProps } from 'antd';
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import React from 'react';

import { GridFilter, GridSorter } from '@ui/common/dtos/get-grid-request.dto';
import { Button } from '@ui/components/Button/Button';
import { FilterClearIcon } from '@ui/components/Icons/FilterClearIcon';
import { FilterResetIcon } from '@ui/components/Icons/FilterResetICon';

export interface TableState<T> {
  filters: Record<string, FilterValue | null>;
  pagination: TablePaginationConfig;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface Props<T> extends TableProps<T> {
  clearFilters?: () => void;
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  resetFilters?: () => void;
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
  clearFilters,
  resetFilters,
  onTableChange,
  total,
  columns,
  expandable,
  ...rest
}: Props<T>): JSX.Element {
  const columnsWidth =
    columns?.reduce((acc, column) => acc + Number(column.width ?? 0), 0) ?? 0;

  const renderTitle =
    clearFilters || resetFilters
      ? () => (
          <Flex justify="flex-end">
            <Space>
              {resetFilters && (
                <Button
                  onClick={() => resetFilters()}
                  type="text"
                  tooltip={{ title: 'Filtros por defecto' }}
                  size="small"
                  icon={<FilterResetIcon />}
                />
              )}

              {clearFilters && (
                <Button
                  onClick={() => clearFilters()}
                  type="text"
                  tooltip={{ title: '   Quitar todos los filtros' }}
                  size="small"
                  icon={<FilterClearIcon />}
                />
              )}
            </Space>
          </Flex>
        )
      : undefined;

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
      title={renderTitle}
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
