import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import { isArray, isEmpty, isObject } from 'lodash';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  GridFilter,
  GridSorter,
} from '@adapters/common/dtos/get-grid-request.dto';
import { DEFAULT_PAGE_SIZE } from '@domain/common/repositories/grid.repository';
import { UrlUtils } from '@shared/utils/url.utils';
import { GridState } from '@ui/components/Grid/Grid';
import { useParsedQs } from '@ui/hooks/useParsedQs';

interface UseTableProps {
  defaultFilters: GridFilter;
  defaultSorter: GridSorter;
}

interface UseTable<T> {
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  setState: React.Dispatch<React.SetStateAction<GridState>>;
  state: GridState;
}

export function useTable<T>({
  defaultSorter,
  defaultFilters,
}: UseTableProps): UseTable<T> {
  const parsedQs = useParsedQs();

  const [, setSearchParams] = useSearchParams();

  const getSorter = (obj: unknown, currentState?: GridState): GridSorter => {
    if (!isObject(obj) || isEmpty(obj) || isArray(obj)) {
      return defaultSorter;
    }

    /**
     * This would be the sorter of the Ant Design Table component.
     */
    if ('field' in obj && typeof obj.field === 'string' && 'order' in obj) {
      if (!obj.order) {
        if (!currentState) {
          return defaultSorter;
        }

        const invertedSorter: GridSorter = {};

        Object.entries(currentState.sorter).forEach(([key, value]) => {
          invertedSorter[key] = value === 'ascend' ? 'descend' : 'ascend';
        });

        return invertedSorter;
      }

      return {
        [obj.field]: obj.order as 'ascend' | 'descend',
      };
    }

    const sorter: GridSorter = {};

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sorter[key] = value as 'ascend' | 'descend';
      }
    });

    return sorter;
  };

  const getFilters = (obj: unknown): GridFilter => {
    if (!isObject(obj) || isEmpty(obj)) {
      return defaultFilters ?? {};
    }

    const filters: GridFilter = { ...defaultFilters };

    Object.entries(obj).forEach(([key, value]) => {
      filters[key] = value ?? [];
    });

    return filters;
  };

  const [state, setState] = useState<GridState>({
    filters: getFilters(parsedQs.filters),
    page: parsedQs.page ? Number(parsedQs.page) : 1,
    pageSize: parsedQs.pageSize ? Number(parsedQs.pageSize) : DEFAULT_PAGE_SIZE,
    sorter: getSorter(parsedQs.sorter),
  });

  useEffect(() => {
    setSearchParams(UrlUtils.stringify(state), { replace: true });
  }, [state, setSearchParams]);

  const onTableChange = (
    antPagination: TablePaginationConfig,
    antFilters: Record<string, FilterValue | null>,
    antSorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    setState({
      ...state,
      filters: getFilters(antFilters),
      page: antPagination.current ?? 1,
      pageSize: antPagination.pageSize ?? DEFAULT_PAGE_SIZE,
      sorter: getSorter(antSorter, state),
    });
  };

  return { onTableChange, setState, state };
}
