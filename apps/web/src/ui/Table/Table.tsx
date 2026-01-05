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
              placement:
                pagination?.pageSize && pagination?.pageSize >= 50
                  ? ['bottomEnd', 'topEnd']
                  : ['bottomEnd'],
              showLessItems: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total}`,
              size: 'small',
              ...pagination,
            }
          : false
      }
      scroll={{ x: 'max-content' }}
      sortDirections={['descend', 'ascend', 'descend']}
      {...props}
    />
  );
}

Table.Column = AntTable.Column;
Table.Summary = AntTable.Summary;
