import { Row as AntRow, type RowProps } from 'antd';

export function Row(props: RowProps) {
  return (
    <AntRow
      gutter={[
        {
          md: 16,
          xs: 8,
        },
        {
          md: 16,
          xs: 8,
        },
      ]}
      {...props}
    />
  );
}
