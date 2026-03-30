import type { FlexProps } from 'antd';

import { Flex, Grid, Statistic, theme, Typography } from 'antd';

import { Card } from '@/ui';

interface HeroStatCardProps {
  accentColor: string;
  background: string;
  gap?: FlexProps['gap'];
  label: React.ReactNode;
  loading?: boolean;
  rightSlot?: React.ReactNode;
  showBorder?: boolean;
  subtitle: string;
  subtitleColor: string;
  value: number | string;
}

export function HeroStatCard({
  accentColor,
  background,
  gap = 'middle',
  label,
  loading = false,
  rightSlot,
  showBorder = false,
  subtitle,
  subtitleColor,
  value,
}: HeroStatCardProps) {
  const { token } = theme.useToken();
  const { lg } = Grid.useBreakpoint();

  return (
    <Card
      styles={{
        body: {
          background,
          ...(showBorder && {
            border: `1px solid ${token.colorBorderSecondary}`,
          }),
        },
      }}
    >
      <Flex gap={gap} justify="space-between" vertical={!lg}>
        <Flex gap="small" vertical>
          <Typography.Text
            strong
            style={{
              color: accentColor,
              fontSize: token.fontSizeSM,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Typography.Text>

          <Statistic
            loading={loading}
            styles={{
              content: {
                color: accentColor,
                fontSize: token.fontSizeHeading3,
              },
            }}
            value={value}
          />

          <Typography.Text style={{ color: subtitleColor }}>
            {subtitle}
          </Typography.Text>
        </Flex>

        {rightSlot && (
          <Flex align={lg ? 'flex-end' : 'flex-start'} gap={8} vertical>
            {rightSlot}
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
