import React, { useEffect, useState } from 'react';
import { Input, Table, TableProps, Typography } from 'antd';
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import { useDebounce } from 'use-debounce';
import { GridUrlQueryParams } from '@shared/types/grid-url-query-params.types';

export interface GridState<T> {
  filters: Record<string, FilterValue | null>;
  pagination: TablePaginationConfig;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface Props<T> extends TableProps<T> {
  gridState: GridUrlQueryParams;
  onStateChange: React.Dispatch<React.SetStateAction<GridUrlQueryParams>>;
  showSearch?: boolean;
  tableTitle?: React.ReactNode;
  total: number;
}

export function Grid<T extends object>({
  rowKey = '_id',
  gridState,
  onStateChange,
  tableTitle,
  total,
  showSearch = false,
  ...rest
}: Props<T>): JSX.Element {
  const [search, setSearch] = useState(gridState.search);

  const [searchDebounced] = useDebounce(search, 750);

  useEffect(() => {
    onStateChange((prevState: GridUrlQueryParams) => ({
      ...prevState,
      page: 1,
      search: searchDebounced,
    }));
  }, [searchDebounced, onStateChange]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onStateChange((prevState: any) => ({
      ...prevState,
      filters,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order ?? 'ascend',
    }));
  };

  const renderTitle = () => (
    <Typography.Text className="text-black text-base flex justify-between mb-3">
      {tableTitle}
    </Typography.Text>
  );

  return (
    <>
      {showSearch && (
        <Input.Search
          placeholder="Buscar..."
          allowClear
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value ?? '')}
        />
      )}
      <Table<T>
        bordered
        title={tableTitle ? renderTitle : undefined}
        size="middle"
        onChange={(
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult<T> | SorterResult<T>[]
        ) => handleTableChange(pagination, filters, sorter as SorterResult<T>)}
        pagination={{
          current: gridState.page,
          hideOnSinglePage: false,
          pageSize: gridState.pageSize,
          pageSizeOptions: ['10', '25', '50', '100', '250'],
          showSizeChanger: false,
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
    </>
  );
}
