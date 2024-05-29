import qs from 'qs';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { DEFAULT_PAGE_SIZE } from '@domain/common/repositories/queryable-grid-repository.interface';
import { GridSorter } from '@infra/controllers/types/get-grid-request.dto';
import { GridState } from '@ui/components/Table/TableNew';

interface UseGridNewProps {
  defaultFilters?: Record<string, string[] | null>;
  defaultSort: GridSorter;
}

export function useGridNew({
  defaultSort,
  defaultFilters = {},
}: UseGridNewProps) {
  const location = useLocation();

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  let sorter: GridSorter = {};

  if (parsedQs.sorter) {
    Object.entries(parsedQs.sorter).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sorter[key] = value as 'ascend' | 'descend';
      }
    });
  } else {
    sorter = defaultSort;
  }

  const filters: Record<string, string[] | null> = defaultFilters;

  if (parsedQs.filters) {
    Object.entries(parsedQs.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        filters[key] = value as string[];
      }
    });
  }

  return useState<GridState>({
    filters,
    page: parsedQs.page ? Number(parsedQs.page) : 1,
    pageSize: parsedQs.pageSize ? Number(parsedQs.pageSize) : DEFAULT_PAGE_SIZE,
    search: parsedQs.search ? String(parsedQs.search) : null,
    sorter,
  });
}
