import { Table as AntTable, TableProps, Typography } from 'antd';
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { DEFAULT_PAGE_SIZE } from '@domain/common/repositories/queryable-grid-repository.interface';
import { GridSorter } from '@infra/controllers/types/get-grid-request.dto';

export interface TableState<T> {
  filters: Record<string, FilterValue | null>;
  pagination: TablePaginationConfig;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface Props<T> extends TableProps<T> {
  setGridState: (state: GridState) => void;
  showSearch?: boolean;
  state: GridState;
  tableTitle?: React.ReactNode;
  total: number;
}

export interface GridState {
  filters: Record<string, string[] | null>;
  page: number;
  pageSize: number;
  search: string | null;
  sorter: GridSorter;
}

export function TableNew<T extends object>({
  rowKey = '_id',
  state,
  setGridState,
  tableTitle,
  total,
  showSearch = false,
  ...rest
}: Props<T>): JSX.Element {
  const [search, setSearch] = useState(state.search);

  const [searchDebounced] = useDebounce(search, 750);

  // useEffect(() => {
  //   setState((prevState: GridState) => ({
  //     ...prevState,
  //     page: 1,
  //     search: searchDebounced,
  //   }));
  // }, [searchDebounced, setState]);

  const handleTableChange = (
    antPagination: TablePaginationConfig,
    antFilters: Record<string, FilterValue | null>,
    antSorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    console.log({
      filters: antFilters,
      gridSorter: antSorter,
      pagination: antPagination,
    });

    const sorter: GridSorter = {};

    const antSorterNormalized = Array.isArray(antSorter)
      ? antSorter
      : [antSorter];

    antSorterNormalized.sort((a, b) => {
      if (
        typeof a.column?.sorter === 'object' &&
        typeof b.column?.sorter === 'object'
      ) {
        const multipleA = a.column.sorter.multiple ?? 0;

        const multipleB = b.column.sorter.multiple ?? 0;

        return multipleB - multipleA;
      }

      return 0;
    });

    antSorterNormalized.forEach((sort) => {
      if (sort.field && typeof sort.field === 'string') {
        sorter[sort.field] = sort.order ?? null;
      }
    });

    const filters: Record<string, string[] | null> = {};

    Object.entries(antFilters).forEach(([key, value]) => {
      if (value) {
        filters[key] = value as string[];
      }
    });

    setGridState({
      ...state,
      filters,
      page: antPagination.current ?? 1,
      pageSize: antPagination.pageSize ?? DEFAULT_PAGE_SIZE,
      sorter,
    });
  };

  const renderTitle = () => (
    <Typography.Text className="mb-3 flex justify-between text-base text-black">
      {tableTitle}
    </Typography.Text>
  );

  return (
    <>
      {/* {showSearch && (
        <Input.Search
          placeholder="Buscar..."
          allowClear
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value ?? '')}
        />
      )} */}

      <AntTable<T>
        bordered
        title={tableTitle ? renderTitle : undefined}
        size="small"
        onChange={(
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult<T> | SorterResult<T>[],
        ) => handleTableChange(pagination, filters, sorter as SorterResult<T>)}
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
    </>
  );
}
