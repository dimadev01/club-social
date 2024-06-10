import { SelectProps } from 'antd';
import { groupBy } from 'lodash';
import React from 'react';

import {
  MemberStatusEnum,
  MemberStatusLabel,
} from '@domain/members/member.enum';
import { Select } from '@ui/components/Select';
import { useMembers } from '@ui/hooks/members/useMembers';

type Props = SelectProps & {
  disableInactive?: boolean;
  groupByStatus?: boolean;
  maxCount?: number;
  showInactiveLabel?: boolean;
  status?: MemberStatusEnum[];
};

export const MembersSelect: React.FC<Props> = ({
  disableInactive = true,
  showInactiveLabel = true,
  status = [MemberStatusEnum.ACTIVE, MemberStatusEnum.INACTIVE],
  ...rest
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
      {...rest}
    />
  );
};
