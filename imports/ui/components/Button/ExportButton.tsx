import { FileExcelOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '@ui/components/Button/Button';

type Props = ButtonProps;

export const ExportButton: React.FC<Props> = ({ ...rest }) => (
  <Button htmlType="button" type="text" icon={<FileExcelOutlined />} {...rest}>
    Exportar
  </Button>
);
