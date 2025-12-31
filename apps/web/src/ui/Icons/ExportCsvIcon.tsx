import { FileExcelOutlined } from '@ant-design/icons';
import React from 'react';

export const ExportCsvIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof FileExcelOutlined>
>((props, ref) => <FileExcelOutlined ref={ref} {...props} />);
