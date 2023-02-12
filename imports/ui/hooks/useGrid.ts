import { useState } from 'react';
import { SortOrder } from 'antd/es/table/interface';
import { useSearchParams } from 'react-router-dom';
import { GridUrlQueryParams } from '@shared/types/grid-url-query-params.types';

export const useGrid = () => {
  const [searchParams] = useSearchParams();

  const state: GridUrlQueryParams = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : 10,
    search: searchParams.get('search') ?? '',
    sortField: searchParams.get('sortField') ?? '',
    sortOrder: (searchParams.get('sortField') as SortOrder) ?? 'descend',
  };

  return useState<GridUrlQueryParams>(state);
};
