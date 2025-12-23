import { Table as AntTable, type TableProps } from 'antd';

export function Table<RecordType>({
  pagination,
  ...props
}: TableProps<RecordType>) {
  return (
    <AntTable
      bordered
      pagination={
        pagination !== false
          ? {
              showLessItems: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total}`,
              size: 'small',
              ...pagination,
            }
          : false
      }
      scroll={{ x: 'max-content', y: 800 }}
      sortDirections={['ascend', 'descend', 'ascend']}
      {...props}
    />
  );
}

Table.Column = AntTable.Column;
Table.Summary = AntTable.Summary;
