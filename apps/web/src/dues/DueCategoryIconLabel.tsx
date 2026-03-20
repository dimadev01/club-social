import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat } from '@club-social/shared/lib';

import { Tag } from '@/ui';

import { DueCategoryIconMap } from './DueCategoryIconMap';

interface Props {
  category: DueCategory;
  date?: string;
}

export function DueCategoryIconLabel({ category, date }: Props) {
  const isMembership = category === DueCategory.MEMBERSHIP;
  const renderDate = !!date && isMembership;

  return (
    <Tag icon={DueCategoryIconMap[category]}>
      {DueCategoryLabel[category]}{' '}
      {renderDate ? `(${DateFormat.monthNameShort(date)})` : ''}
    </Tag>
  );
}
