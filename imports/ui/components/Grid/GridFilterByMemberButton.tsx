import { CloseOutlined, FilterOutlined } from '@ant-design/icons';
import React from 'react';

import { Button } from '@ui/components/Button';
import { GridState } from '@ui/components/Grid/Grid';

interface Props {
  gridState: GridState;
  memberId: string;
  setState: React.Dispatch<React.SetStateAction<GridState>>;
}

export const GridFilterByMemberButton: React.FC<Props> = ({
  gridState,
  memberId,
  setState,
}) => (
  <>
    {!gridState.filters?.memberId && (
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
        icon={<FilterOutlined />}
      />
    )}

    {gridState.filters?.memberId && (
      <Button
        type="text"
        disabled={!memberId}
        onClick={() => {
          setState({
            ...gridState,
            filters: {
              ...gridState.filters,
              memberId: undefined,
            },
          });
        }}
        htmlType="button"
        tooltip={{ title: 'Quitar filtro' }}
        icon={<CloseOutlined />}
      />
    )}
  </>
);
