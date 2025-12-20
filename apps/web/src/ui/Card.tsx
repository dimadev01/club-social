import {
  Card as AntCard,
  Button,
  type CardProps,
  Skeleton,
  Space,
  Tooltip,
} from 'antd';
import { useNavigate } from 'react-router';

import { BackIcon } from './Icons/BackIcon';

interface Props extends CardProps {
  backButton?: boolean;
}

export function Card({ backButton, loading, title, ...props }: Props) {
  const navigate = useNavigate();

  return (
    <AntCard
      title={
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
      }
      {...props}
    />
  );
}
