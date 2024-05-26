import { ReloadOutlined } from '@ant-design/icons';
import React from 'react';

import { Button } from '@ui/components/Button';

type Props = {
  isRefetching: boolean;
  refetch: () => void;
};

export const TableReloadButton: React.FC<Props> = ({
  refetch,
  isRefetching,
}) => (
  <Button
    onClick={() => refetch()}
    loading={isRefetching}
    disabled={isRefetching}
    tooltip={{ title: 'Recargar' }}
    htmlType="button"
    type="text"
    icon={<ReloadOutlined />}
  />
);
