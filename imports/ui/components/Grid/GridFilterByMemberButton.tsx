import React from 'react';

import { RoleEnum } from '@domain/roles/role.enum';
import { Button } from '@ui/components/Button/Button';
import { GridState } from '@ui/components/Grid/Grid';
import { FilterClearIcon } from '@ui/components/Icons/FilterClearIcon';
import { FilterIcon } from '@ui/components/Icons/FilterIcon';

interface Props {
  gridState: GridState;
  memberId: string;
  setState: React.Dispatch<React.SetStateAction<GridState>>;
}

export const GridFilterByMemberButton: React.FC<Props> = ({
  gridState,
  memberId,
  setState,
}) => {
  const user = Meteor.user();

  if (!user) {
    return null;
  }

  if (user.profile?.role === RoleEnum.MEMBER) {
    return null;
  }

  return (
    <>
      {gridState.filters.memberId.length === 0 && (
        <Button
          type="text"
          onClick={() => {
            setState({
              ...gridState,
              filters: {
                ...gridState.filters,
                memberId: [memberId],
              },
            });
          }}
          htmlType="button"
          tooltip={{ title: 'Filtrar por este socio' }}
          icon={<FilterIcon />}
        />
      )}

      {gridState.filters.memberId.length > 0 && (
        <Button
          type="text"
          disabled={!memberId}
          onClick={() => {
            setState({
              ...gridState,
              filters: { ...gridState.filters, memberId: [] },
            });
          }}
          htmlType="button"
          tooltip={{ title: 'Quitar filtro' }}
          icon={<FilterClearIcon />}
        />
      )}
    </>
  );
};
