import type { MemberSearchResultDto } from '@club-social/shared/members';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';

interface Props {
  disabled?: boolean;
  isLoading: boolean;
  onFilterChange: (value?: string[]) => void;
  selectedMembers: MemberSearchResultDto[];
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
      className="min-w-full md:min-w-60"
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
