import qs from 'qs';
import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { GridState } from '@ui/components/Table/TableNew';

export function useGridNew() {
  const [searchParams] = useSearchParams();

  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  return useState<GridState>({
    filters: {},
    page: 1,
    pageSize: 10,
    search: null,
    sorter: {
      createdAt: 'descend',
    },
  });
}
