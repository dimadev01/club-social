import type { MemberSearchResultDto } from '@club-social/shared/members';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';

interface Props {
  isFetching: boolean;
  onFilterChange: (value?: string[]) => void;
  selectedMembers: MemberSearchResultDto[];
  value?: string[];
}

export function TableMembersSearch({
  isFetching,
  onFilterChange,
  selectedMembers,
  value,
}: Props) {
  return (
    <MemberSearchSelect
      additionalOptions={selectedMembers}
      allowClear
      className="min-w-xs"
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
