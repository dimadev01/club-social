import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@ui/components/Button';

type Props = {
  to: string;
};

export const TableNewButton: React.FC<Props> = ({ to }) => (
  <Link to={to}>
    <Button
      icon={<PlusOutlined />}
      type="text"
      htmlType="button"
      tooltip={{ title: 'Nuevo' }}
    />
  </Link>
);
