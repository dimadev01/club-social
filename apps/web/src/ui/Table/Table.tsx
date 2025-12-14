import { Table as AntTable, type TableProps } from 'antd';

export function Table<RecordType>(props: TableProps<RecordType>) {
  return <AntTable scroll={{ x: 'max-content', y: 800 }} {...props} />;
}

Table.Column = AntTable.Column;
