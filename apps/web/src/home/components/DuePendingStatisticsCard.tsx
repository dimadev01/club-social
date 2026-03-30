import { InfoCircleOutlined } from '@ant-design/icons';
import {
  DueCategory,
  DueCategoryLabel,
  DueCategorySorted,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { UserRole } from '@club-social/shared/users';
import { Flex, Space, Statistic, theme, Tooltip, Typography } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useSessionUser } from '@/auth/useUser';
import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { useDueCategoryColors } from '@/dues/useDueCategoryColors';
import { Card, PageHeading } from '@/ui';

import { useDuePendingStatistics } from '../useDuePendingStatistics';
import { HeroStatCard } from './HeroStatCard';

interface Props {
  dateRange?: [string, string];
}

const LinkCategoryMap = {
  [DueCategory.ELECTRICITY]: appRoutes.dues.list,
  [DueCategory.GUEST]: appRoutes.dues.list,
  [DueCategory.MEMBERSHIP]: appRoutes.dues.list,
};

export function DuePendingStatisticsCard({ dateRange }: Props) {
  const { data, isLoading } = useDuePendingStatistics({ dateRange });
  const { token } = theme.useToken();

  const user = useSessionUser();
  const isMember = user.role === UserRole.MEMBER;
  const categoryColor = useDueCategoryColors();

  return (
    <Flex gap="middle" vertical>
      <PageHeading className="mb-0">Deudas pendientes</PageHeading>

      <HeroStatCard
        accentColor={token.colorWarning}
        background={token.colorWarningBg}
        label={
          <Space size="small">
            Total pendiente
            {!isMember && (
              <Tooltip title="Deudas pendientes y parcialmente pagadas de socios activos">
                <InfoCircleOutlined style={{ color: token.colorWarning }} />
              </Tooltip>
            )}
          </Space>
        }
        loading={isLoading}
        showBorder
        subtitle="Saldo pendiente por cobrar"
        subtitleColor={token.colorTextSecondary}
        value={NumberFormat.currencyCents(data?.total ?? 0)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DueCategorySorted.map((category) => (
          <Link
            className="block"
            key={category}
            to={{
              pathname: LinkCategoryMap[category],
              search: new URLSearchParams({
                filters: `category:${category}`,
              }).toString(),
            }}
          >
            <Card className="h-full">
              <Statistic
                loading={isLoading}
                styles={{
                  content: {
                    color: categoryColor[category],
                  },
                  title: {
                    fontSize: token.fontSizeSM,
                  },
                }}
                title={
                  <Space size="small">
                    <span style={{ color: categoryColor[category] }}>
                      {DueCategoryIconMap[category]}
                    </span>
                    <Typography.Text strong type="secondary">
                      {DueCategoryLabel[category]}
                    </Typography.Text>
                  </Space>
                }
                value={NumberFormat.currencyCents(
                  data?.categories[category] ?? 0,
                )}
              />
            </Card>
          </Link>
        ))}
      </div>
    </Flex>
  );
}
