import { useState } from 'react';
import { SortOrder } from 'antd/es/table/interface';
import qs from 'qs';
import { useLocation, useSearchParams } from 'react-router-dom';
import { GridUrlQueryParams } from '@shared/types/grid-url-query-params.types';

interface DefaultParams {
  sortField: string;
  sortOrder: SortOrder;
}

export const useGrid = ({
  sortField = 'createdAt',
  sortOrder = 'descend',
}: DefaultParams) => {
  const [searchParams] = useSearchParams();

  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  return useState<GridUrlQueryParams>({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : 25,
    search: searchParams.get('search') ?? '',
    sortField: (parsedQs.sortField as string | string[]) ?? sortField,
    sortOrder: (searchParams.get('sortOrder') as SortOrder) ?? sortOrder,
  });
};
