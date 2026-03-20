import type { ButtonProps } from 'antd';

import { useNavigate } from 'react-router';

import { Button } from './Button';
import { BackIcon } from './Icons/BackIcon';

export function BackButton(props: ButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      icon={<BackIcon />}
      onClick={() => navigate(-1)}
      tooltip="Volver"
      type="text"
      {...props}
    />
  );
}
