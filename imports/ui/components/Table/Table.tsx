import { Table as AntTable, TableProps } from 'antd';
import React from 'react';

type Props<T> = TableProps<T>;

export function Table<T extends object>({ columns, ...rest }: Props<T>) {
  const columnsWidth =
    columns?.reduce((acc, column) => acc + Number(column.width ?? 0), 0) ?? 0;

  return (
    <AntTable
      bordered
      size="small"
      pagination={false}
      columns={columns}
      scroll={{
        scrollToFirstRowOnChange: true,
        x: columnsWidth,
        y: 400,
      }}
      {...rest}
    />
  );
}
