import { Row as AntRow, type RowProps } from 'antd';

export function Row(props: RowProps) {
  return (
    <AntRow
      gutter={[
        {
          sm: 16,
          xs: 8,
        },
        {
          sm: 16,
          xs: 8,
        },
      ]}
      {...props}
    />
  );
}
