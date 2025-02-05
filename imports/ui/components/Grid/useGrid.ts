import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/es/table/interface';
import { isArray, isEmpty, isObject } from 'lodash';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE_SIZE } from '@application/common/repositories/grid.repository';
import { UrlUtils } from '@shared/utils/url.utils';
import { GridFilter, GridSorter } from '@ui/common/dtos/get-grid-request.dto';
import { GridState } from '@ui/components/Grid/Grid';
import { useParsedQs } from '@ui/hooks/ui/useParsedQs';

interface UseTableProps {
  defaultFilters: GridFilter;
  defaultSorter: GridSorter;
}

interface UseTable<T> {
  clearFilters: () => void;
  gridState: GridState;
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  resetFilters: () => void;
  setGridState: React.Dispatch<React.SetStateAction<GridState>>;
}

export function useGrid<T>({
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
        if (!Object.getOwnPropertyNames(defaultSorter).includes(obj.field)) {
          return defaultSorter;
        }

        const invertedSorter: GridSorter = {};

        Object.entries(currentState?.sorter ?? defaultSorter).forEach(
          ([key, value]) => {
            invertedSorter[key] = value === 'ascend' ? 'descend' : 'ascend';
          },
        );

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

  const [gridState, setGridState] = useState<GridState>({
    filters: getFilters(parsedQs.filters),
    page: parsedQs.page ? Number(parsedQs.page) : 1,
    pageSize: parsedQs.pageSize ? Number(parsedQs.pageSize) : DEFAULT_PAGE_SIZE,
    sorter: getSorter(parsedQs.sorter),
  });

  const onTableChange = (
    antPagination: TablePaginationConfig,
    antFilters: Record<string, FilterValue | null>,
    antSorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    const newState: GridState = {
      ...gridState,
      filters: getFilters(antFilters),
      page: antPagination.current ?? 1,
      pageSize: antPagination.pageSize ?? DEFAULT_PAGE_SIZE,
      sorter: getSorter(antSorter, gridState),
    };

    setGridState(newState);

    setSearchParams(UrlUtils.stringify(newState), { replace: true });
  };

  const clearFilters = () => {
    const filters: GridFilter = {};

    Object.keys(gridState.filters).forEach((key) => {
      filters[key] = [];
    });

    setGridState({ ...gridState, filters });
  };

  const resetFilters = () => {
    setGridState({ ...gridState, filters: defaultFilters });
  };

  return {
    clearFilters,
    gridState,
    onTableChange,
    resetFilters,
    setGridState,
  };
}
