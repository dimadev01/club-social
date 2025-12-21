import type { IMemberSearchResultDto } from '@club-social/shared/members';

import { Grid } from 'antd';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { cn } from '@/shared/lib/utils';

interface Props {
  disabled?: boolean;
  isLoading: boolean;
  onFilterChange: (value?: string[]) => void;
  selectedMembers: IMemberSearchResultDto[];
  value?: string[];
}

export function TableMembersSearch({
  disabled,
  isLoading,
  onFilterChange,
  selectedMembers,
  value,
}: Props) {
  const { md } = Grid.useBreakpoint();

  return (
    <MemberSearchSelect
      additionalOptions={selectedMembers}
      allowClear
      className={cn('min-w-full', { 'min-w-xs': md })}
      disabled={disabled || isLoading}
      loading={isLoading}
      mode="multiple"
      onChange={(value) =>
        onFilterChange(value?.length ? (value as string[]) : undefined)
      }
      placeholder="Filtrar por socio..."
      value={value}
    />
  );
}
