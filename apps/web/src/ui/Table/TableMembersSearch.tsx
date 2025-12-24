import type { IMemberSearchResultDto } from '@club-social/shared/members';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';

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
  return (
    <MemberSearchSelect
      additionalOptions={selectedMembers}
      allowClear
      className="min-w-full md:min-w-xs"
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
