import type { Dayjs } from 'dayjs';

import { InfoCircleOutlined } from '@ant-design/icons';
import {
  DueCategory,
  DueCategoryLabel,
  DueCategorySorted,
} from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { UserRole } from '@club-social/shared/users';
import { Space, Statistic, Tooltip } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useSessionUser } from '@/auth/useUser';
import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { Card, DuesIcon } from '@/ui';

import { useDuePendingStatistics } from '../useDuePendingStatistics';

interface Props {
  dateRange: [Dayjs, Dayjs] | null;
}

const LinkCategoryMap = {
  [DueCategory.ELECTRICITY]: appRoutes.dues.list,
  [DueCategory.GUEST]: appRoutes.dues.list,
  [DueCategory.MEMBERSHIP]: appRoutes.dues.list,
};

export function DuePendingStatisticsCard({ dateRange }: Props) {
  const { data, isLoading } = useDuePendingStatistics({
    dateRange: dateRange
      ? [DateFormat.isoDate(dateRange[0]), DateFormat.isoDate(dateRange[1])]
      : undefined,
  });

  const user = useSessionUser();

  const isMember = user.role === UserRole.MEMBER;

  return (
    <Card
      extra={<DuesIcon />}
      size="small"
      title={
        <Space size="small">
          Deudas pendientes
          {!isMember && (
            <Tooltip title="Solamente socios activos">
              <InfoCircleOutlined />
            </Tooltip>
          )}
        </Space>
      }
      type="inner"
    >
      {DueCategorySorted.map((category) => (
        <Link
          className="w-full md:w-1/3"
          to={{
            pathname: LinkCategoryMap[category],
            search: new URLSearchParams({
              filters: `category:${category}`,
            }).toString(),
          }}
        >
          <Card.Grid className="w-full" key={category}>
            <Statistic
              loading={isLoading}
              prefix={DueCategoryIconMap[category]}
              title={DueCategoryLabel[category]}
              value={NumberFormat.currencyCents(
                data?.categories[category] ?? 0,
              )}
            />
          </Card.Grid>
        </Link>
      ))}
      <Card.Grid className="w-full">
        <Statistic
          loading={isLoading}
          title="Total"
          value={NumberFormat.currencyCents(data?.total ?? 0)}
        />
      </Card.Grid>
    </Card>
  );
}
