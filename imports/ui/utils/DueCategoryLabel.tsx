import { BulbOutlined, TeamOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import { GiTennisCourt } from 'react-icons/gi';
import invariant from 'tiny-invariant';

import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { renderDueCategoryLabel } from '@ui/utils/renderDueCategory';

type Props = {
  category: DueCategoryEnum;
  date?: string;
};

export const DueCategoryIconWithLabel: React.FC<Props> = ({
  category,
  date,
}) => {
  let icon: React.ReactNode;

  if (category === DueCategoryEnum.ELECTRICITY) {
    icon = <BulbOutlined />;
  } else if (category === DueCategoryEnum.GUEST) {
    icon = <TeamOutlined />;
  } else if (category === DueCategoryEnum.MEMBERSHIP) {
    icon = <GiTennisCourt />;
  }

  invariant(icon);

  return (
    <Space>
      {icon}

      {date && renderDueCategoryLabel(category, date)}

      {!date && DueCategoryLabel[category]}
    </Space>
  );
};

export const getDueCategoryOptionsReact = () =>
  Object.values(DueCategoryEnum)
    .map((category) => ({
      label: <DueCategoryIconWithLabel category={category} />,
      value: category,
    }))
    .sort((a, b) => a.value.localeCompare(b.value));
