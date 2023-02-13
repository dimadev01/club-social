import React, { useState } from 'react';
import { Table, TableProps, Typography } from 'antd';
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import { GridUrlQueryParams } from '@shared/types/grid-url-query-params.types';

export interface GridState<T> {
  filters: Record<string, FilterValue | null>;
  pagination: TablePaginationConfig;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface Props<T> extends TableProps<T> {
  fixHeader?: boolean;
  gridState?: GridUrlQueryParams;
  onStateChange: React.Dispatch<React.SetStateAction<GridUrlQueryParams>>;
  showNew?: boolean;
  tableTitle?: React.ReactNode;
  total: number;
}

export function Grid<T extends object>({
  rowKey = '_id',
  gridState,
  onStateChange,
  tableTitle,
  total,
  ...rest
}: Props<T>): JSX.Element {
  const [state, setState] = useState<GridState<T> | undefined>(undefined);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T>
  ) => {
    console.log(sorter);

    if (onStateChange) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onStateChange((prevState: any) => ({
        ...prevState,
        filters,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
      }));
    } else {
      setState({ filters, pagination, sorter });
    }
  };

  const renderTitle = () => (
    <Typography.Text className="text-black text-base flex justify-between mb-3">
      {tableTitle}
    </Typography.Text>
  );

  return (
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
        current: gridState?.page ?? state?.pagination.current ?? 1,
        hideOnSinglePage: false,
        pageSize: gridState?.pageSize ?? state?.pagination.pageSize ?? 25,
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
  );
}
