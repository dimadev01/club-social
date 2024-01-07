import React from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import { Button } from '@ui/components/Button';

type Props = {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
};

export const TablePrintButton: React.FC<Props> = ({
  onClick,
  isLoading = false,
  isDisabled = false,
}) => (
  <Button
    onClick={onClick}
    loading={isLoading}
    disabled={isDisabled}
    tooltip={{ title: 'Imprimir' }}
    htmlType="button"
    type="text"
    icon={<PrinterOutlined />}
  />
);
