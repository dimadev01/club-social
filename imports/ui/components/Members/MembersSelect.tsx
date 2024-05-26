import { SelectProps } from 'antd';
import React from 'react';

import { Select } from '@ui/components/Select';
import { useMembers } from '@ui/hooks/members/useMembers';

type Props = SelectProps;

export const MembersSelect: React.FC<Props> = ({ ...rest }) => {
  const { data: members, isLoading: isLoadingMembers } = useMembers();

  return (
    <Select
      loading={isLoadingMembers}
      disabled={isLoadingMembers}
      options={members?.map((m) => ({
        label: m.name,
        value: m._id,
      }))}
      placeholder="Seleccionar socio"
      {...rest}
    />
  );
};
