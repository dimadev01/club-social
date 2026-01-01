import { Row as AntRow, type RowProps } from 'antd';

export function Row(props: RowProps) {
  return <AntRow gutter={[16, 16]} {...props} />;
}
