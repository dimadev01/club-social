import type { IMemberSearchResultDto } from '@club-social/shared/members';

import { Grid } from 'antd';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { cn } from '@/shared/lib/utils';

interface Props {
  isFetching: boolean;
  onFilterChange: (value?: string[]) => void;
  selectedMembers: IMemberSearchResultDto[];
  value?: string[];
}

export function TableMembersSearch({
  isFetching,
  onFilterChange,
  selectedMembers,
  value,
}: Props) {
  const { md } = Grid.useBreakpoint();

  return (
    <MemberSearchSelect
      additionalOptions={selectedMembers}
      allowClear
      className={cn('w-full', {
        'w-xs': md,
      })}
      disabled={isFetching}
      loading={isFetching}
      mode="multiple"
      onChange={(value) =>
        onFilterChange(value?.length ? (value as string[]) : undefined)
      }
      placeholder="Filtrar por socio..."
      value={value}
    />
  );
}
