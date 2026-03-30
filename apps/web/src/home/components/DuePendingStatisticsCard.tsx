import { purple, purpleDark } from '@ant-design/colors';
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
import { Card, PageHeading } from '@/ui';

import { useDuePendingStatistics } from '../useDuePendingStatistics';

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
  const isDark = token.colorBgBase === '#000000';

  const categoryColor: Record<DueCategory, string> = {
    [DueCategory.ELECTRICITY]: token.colorWarning,
    [DueCategory.GUEST]: isDark ? purpleDark[5] : purple[5],
    [DueCategory.MEMBERSHIP]: token.colorSuccess,
  };

  return (
    <Flex gap="middle" vertical>
      <PageHeading className="mb-0">Deudas pendientes</PageHeading>

      <Card
        styles={{
          body: {
            background: token.colorWarningBg,
            border: `1px solid ${token.colorBorderSecondary}`,
          },
        }}
      >
        <Flex gap="small" vertical>
          <Flex gap="small" vertical>
            <Space size="small">
              <Typography.Text
                strong
                style={{
                  color: token.colorWarning,
                  fontSize: token.fontSizeSM,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Total pendiente
              </Typography.Text>
              {!isMember && (
                <Tooltip title="Deudas pendientes y parcialmente pagadas de socios activos">
                  <InfoCircleOutlined style={{ color: token.colorWarning }} />
                </Tooltip>
              )}
            </Space>

            <Statistic
              loading={isLoading}
              styles={{
                content: {
                  color: token.colorWarning,
                  fontSize: token.fontSizeHeading3,
                },
              }}
              value={NumberFormat.currencyCents(data?.total ?? 0)}
            />

            <Typography.Text style={{ color: token.colorTextSecondary }}>
              Saldo pendiente por cobrar
            </Typography.Text>
          </Flex>
        </Flex>
      </Card>

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
