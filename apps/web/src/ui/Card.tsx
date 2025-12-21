import {
  Card as AntCard,
  type CardProps as AntCardProps,
  Button,
  Skeleton,
  Space,
  Tooltip,
} from 'antd';
import { useNavigate } from 'react-router';

import { BackIcon } from './Icons/BackIcon';

export interface CardProps extends AntCardProps {
  backButton?: boolean;
}

export function Card({ backButton, loading, title, ...props }: CardProps) {
  const navigate = useNavigate();

  return (
    <AntCard
      {...(title && {
        title: (
          <Space>
            {backButton && (
              <Tooltip title="Volver">
                <Button
                  icon={<BackIcon />}
                  onClick={() => navigate(-1)}
                  size="small"
                  type="text"
                />
              </Tooltip>
            )}
            {loading && <Skeleton.Input active />}
            {!loading && title}
          </Space>
        ),
      })}
      {...props}
    />
  );
}

Card.Grid = AntCard.Grid;
