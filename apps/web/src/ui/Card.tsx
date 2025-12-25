import {
  Card as AntCard,
  type CardProps as AntCardProps,
  Button,
  Space,
  Tooltip,
} from 'antd';
import { useNavigate } from 'react-router';

import { BackIcon } from './Icons/BackIcon';

export interface CardProps extends AntCardProps {
  backButton?: boolean;
}

export function Card({
  backButton = false,
  loading,
  title,
  ...props
}: CardProps) {
  const navigate = useNavigate();

  return (
    <AntCard
      loading={loading}
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

            {title}
            {/* {loading && loadingTitle && <Skeleton.Input active />}
            {loading && !loadingTitle && title}
            {!loading && title} */}
          </Space>
        ),
      })}
      {...props}
    />
  );
}

Card.Grid = AntCard.Grid;
