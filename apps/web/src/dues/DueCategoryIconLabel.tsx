import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat } from '@club-social/shared/lib';
import { Space } from 'antd';

import { DueCategoryIconMap } from './DueCategoryIconMap';

interface Props {
  category: DueCategory;
  date?: string;
}

export function DueCategoryIconLabel({ category, date }: Props) {
  const isMembership = category === DueCategory.MEMBERSHIP;
  const renderDate = !!date && isMembership;

  return (
    <Space size="small">
      {DueCategoryIconMap[category]}
      <span>
        {DueCategoryLabel[category]}{' '}
        {renderDate ? `(${DateFormat.month(date)})` : ''}
      </span>
    </Space>
  );
}
