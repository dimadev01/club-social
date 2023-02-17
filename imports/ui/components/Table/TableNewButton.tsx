import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@ui/components/Button';

type Props = {
  to: string;
};

export const TableNewButton: React.FC<Props> = ({ to }) => (
  <NavLink to={to}>
    <Button
      icon={<PlusOutlined />}
      type="ghost"
      htmlType="button"
      tooltip={{ title: 'Nuevo' }}
    />
  </NavLink>
);
