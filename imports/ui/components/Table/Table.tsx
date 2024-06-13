import { Table as AntTable, TableProps } from 'antd';
import React from 'react';

type Props = TableProps;

export const Table: React.FC<Props> = ({ columns, ...rest }) => {
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
        y: 600,
      }}
      {...rest}
    />
  );
};
