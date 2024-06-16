import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '@ui/components/Button/Button';
import { ExportCsvIcon } from '@ui/components/Icons/ExportCsvIcon';

type Props = ButtonProps;

export const ExportButton: React.FC<Props> = ({ ...rest }) => (
  <Button htmlType="button" type="text" icon={<ExportCsvIcon />} {...rest}>
    Exportar
  </Button>
);
