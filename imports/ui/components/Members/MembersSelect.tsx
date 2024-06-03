import { SelectProps } from 'antd';
import { groupBy } from 'lodash';
import React from 'react';

import {
  MemberStatusEnum,
  MemberStatusLabel,
} from '@domain/members/member.enum';
import { Select } from '@ui/components/Select';
import { useMembers } from '@ui/hooks/members/useMembers';

interface Props {
  disableInactive?: boolean;
  groupByStatus?: boolean;
  maxCount?: number;
  onChange?: (value: any) => void;
  select?: SelectProps;
  showInactiveLabel?: boolean;
  status?: MemberStatusEnum[];
  value?: any | null;
}

export const MembersSelect: React.FC<Props> = ({
  disableInactive = true,
  select,
  showInactiveLabel = true,
  status = [MemberStatusEnum.ACTIVE, MemberStatusEnum.INACTIVE],
  onChange,
  value,
}) => {
  const { data: members, isLoading: isLoadingMembers } = useMembers({ status });

  const groupedByStatus = groupBy(members, 'status');

  const getOptions = () =>
    Object.entries(groupedByStatus).map(([key, membersByStatus]) => ({
      label: MemberStatusLabel[key as MemberStatusEnum],
      options: membersByStatus.map((member) => {
        const isInactive = member.status === MemberStatusEnum.INACTIVE;

        let label = member.name;

        if (showInactiveLabel && isInactive) {
          label += ` (${MemberStatusLabel[MemberStatusEnum.INACTIVE]})`;
        }

        return {
          disabled: disableInactive && isInactive,
          label,
          value: member.id,
        };
      }),
    }));

  return (
    <Select
      loading={isLoadingMembers}
      disabled={isLoadingMembers}
      options={getOptions()}
      placeholder="Seleccionar socio"
      onChange={onChange}
      value={value}
      {...select}
    />
  );
};
