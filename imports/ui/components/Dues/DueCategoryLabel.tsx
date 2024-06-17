import { Space } from 'antd';
import React from 'react';

import { DueCategoryEnum, formatDueCategoryLabel } from '@domain/dues/due.enum';
import { DueCategoryIcon } from '@ui/components/Dues/Dues.utils';

type Props = {
  category: DueCategoryEnum;
  date: string;
};

export const DueCategoryIconWithLabel: React.FC<Props> = ({
  category,
  date,
}) => (
  <Space>
    {DueCategoryIcon[category]}
    {formatDueCategoryLabel(category, date)}
  </Space>
);
