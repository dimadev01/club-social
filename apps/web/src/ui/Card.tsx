import { Card as AntCard, type CardProps as AntCardProps, Space } from 'antd';
import { useNavigate } from 'react-router';

import { cn } from '@/shared/lib/utils';

import { Button } from './Button';
import { BackIcon } from './Icons/BackIcon';

export interface CardProps extends AntCardProps {
  backButton?: boolean;
}

export function Card({
  backButton = false,
  classNames,
  loading,
  title,
  ...props
}: CardProps) {
  const navigate = useNavigate();

  return (
    <AntCard
      classNames={{
        header: cn('[&>.ant-card-head-wrapper]:gap-2'),
        ...classNames,
      }}
      loading={loading}
      {...(title && {
        title: (
          <Space size="small">
            {backButton && (
              <Button
                icon={<BackIcon />}
                onClick={() => navigate(-1)}
                size="small"
                tooltip="Volver"
                type="text"
              />
            )}

            {title}
          </Space>
        ),
      })}
      {...props}
    />
  );
}

Card.Grid = AntCard.Grid;
