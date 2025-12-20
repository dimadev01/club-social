/**
 * Created by Claude Opus 4.5
 * Date: 2025-12-17
 */
import type { TablePaginationConfig } from 'antd';
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/es/table/interface';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

// Types
interface SortItem {
  field: string;
  order: SortOrder;
}

type SortOrder = 'ascend' | 'descend';

interface TableParams {
  defaultFilters?: Record<string, string[]>;
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSort: SortItem[];
}

interface TableQuery {
  [key: string]: number | string | string[];
  page: number;
  pageSize: number;
}

interface TableState {
  filters: Record<string, string[]>;
  page: number;
  pageSize: number;
  sort: SortItem[];
}

const DEFAULT_PAGE_SIZE = 20;

export function useTable<T = unknown>({
  defaultFilters,
  defaultPage = 1,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultSort,
}: TableParams) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive state from URL (single source of truth)
  const state = useMemo<TableState>(
    () => ({
      filters: parseFilters(searchParams.get('filters'), defaultFilters),
      page: Number(searchParams.get('page')) || defaultPage,
      pageSize: Number(searchParams.get('pageSize')) || defaultPageSize,
      sort: parseSort(searchParams.get('sort'), defaultSort),
    }),
    [searchParams, defaultFilters, defaultPage, defaultPageSize, defaultSort],
  );

  // Build query object for API calls
  const query = useMemo(() => buildApiQuery(state), [state]);

  // Helper to get sort order for a specific field
  const getSortOrder = useCallback(
    (field: string): SortOrder | undefined =>
      state.sort.find((s) => s.field === field)?.order,
    [state.sort],
  );

  // Helper to get filter value for a specific field (returns null for Ant Design compatibility)
  const getFilterValue = useCallback(
    (field: string): null | string[] => state.filters[field] ?? null,
    [state.filters],
  );

  // Clear all filters (uses empty string to indicate explicit clear)
  const clearFilters = useCallback(() => {
    const params: Record<string, string> = {
      filters: '',
      page: '1',
      pageSize: String(state.pageSize),
    };

    if (state.sort.length > 0) {
      params.sort = serializeSortToUrl(state.sort);
    }

    setSearchParams(params);
  }, [setSearchParams, state.pageSize, state.sort]);

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    const params: Record<string, string> = {
      page: '1',
      pageSize: String(state.pageSize),
    };

    if (state.sort.length > 0) {
      params.sort = serializeSortToUrl(state.sort);
    }

    if (defaultFilters && Object.keys(defaultFilters).length > 0) {
      params.filters = serializeFiltersToUrl(defaultFilters);
    }

    setSearchParams(params);
  }, [setSearchParams, state.pageSize, state.sort, defaultFilters]);

  // Set a specific filter
  const setFilter = useCallback(
    (field: string, values: string[] | undefined) => {
      let newFilters: Record<string, string[]>;

      if (values && values.length > 0) {
        newFilters = { ...state.filters, [field]: values };
      } else {
        const { [field]: _, ...restFilters } = state.filters;
        newFilters = restFilters;
      }

      const params: Record<string, string> = {
        page: '1',
        pageSize: String(state.pageSize),
      };

      if (state.sort.length > 0) {
        params.sort = serializeSortToUrl(state.sort);
      }

      if (Object.keys(newFilters).length > 0) {
        params.filters = serializeFiltersToUrl(newFilters);
      }

      setSearchParams(params);
    },
    [setSearchParams, state.filters, state.pageSize, state.sort],
  );

  // Handle table changes
  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      tableFilters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
      _extra: TableCurrentDataSource<T>,
    ) => {
      console.log(tableFilters);
      // Normalize sorter to array
      const sorterArray = Array.isArray(sorter) ? sorter : [sorter];
      const newSort: SortItem[] = sorterArray
        .filter((s) => s.field !== undefined && s.order !== undefined)
        .map((s) => ({ field: String(s.field), order: s.order as SortOrder }));

      // Merge table filters with existing external filters
      // Start with current filters, then update based on tableFilters
      const tableFilterKeys = Object.keys(tableFilters);

      const newFilters = Object.entries(state.filters).reduce<
        Record<string, string[]>
      >((acc, [key, value]) => {
        // Preserve external filters (not managed by table columns)
        if (!tableFilterKeys.includes(key)) {
          acc[key] = value;
        }

        return acc;
      }, {});

      // Add table column filters
      Object.entries(tableFilters).forEach(([key, value]) => {
        if (value !== null && value.length > 0) {
          newFilters[key] = value.map(String);
        }
      });

      // Build URL params
      const params: Record<string, string> = {
        page: String(pagination.current ?? state.page),
        pageSize: String(pagination.pageSize ?? state.pageSize),
      };

      if (newSort.length > 0) {
        params.sort = serializeSortToUrl(newSort);
      }

      if (Object.keys(newFilters).length > 0) {
        params.filters = serializeFiltersToUrl(newFilters);
      }

      setSearchParams(params);
    },
    [setSearchParams, state.filters, state.page, state.pageSize],
  );

  return {
    clearFilters,
    getFilterValue,
    getSortOrder,
    onChange,
    query,
    resetFilters,
    setFilter,
    state,
  };
}

// API Query Building
function buildApiQuery(state: TableState): TableQuery {
  const query: TableQuery = {
    page: state.page,
    pageSize: state.pageSize,
  };

  state.sort.forEach((s, i) => {
    query[`sort[${i}][field]`] = s.field;
    query[`sort[${i}][order]`] = s.order;
  });

  Object.entries(state.filters).forEach(([key, value]) => {
    query[`filters[${key}]`] = value;
  });

  return query;
}

function parseFilters(
  filtersParam: null | string,
  defaultFilters?: Record<string, string[]>,
): Record<string, string[]> {
  // No param in URL → use defaults (initial page load)
  if (filtersParam === null) {
    return defaultFilters ?? {};
  }

  // Empty string → filters were explicitly cleared
  if (filtersParam === '') {
    return {};
  }

  return filtersParam
    .split(';')
    .reduce<Record<string, string[]>>((acc, item) => {
      const colonIndex = item.indexOf(':');

      if (colonIndex === -1) return acc;

      const key = item.slice(0, colonIndex);
      const value = item.slice(colonIndex + 1);

      acc[key] = value.split(',');

      return acc;
    }, {});
}

// URL Parsing
function parseSort(
  sortParam: null | string,
  defaultSort: SortItem[],
): SortItem[] {
  if (!sortParam) {
    return defaultSort;
  }

  return sortParam.split(',').map((item) => {
    const colonIndex = item.indexOf(':');

    if (colonIndex === -1) {
      return { field: item, order: 'ascend' as SortOrder };
    }

    const field = item.slice(0, colonIndex);
    const order = item.slice(colonIndex + 1);

    return { field, order: order as SortOrder };
  });
}

function serializeFiltersToUrl(filters: Record<string, string[]>): string {
  return Object.entries(filters)
    .map(([key, value]) => `${key}:${value.join(',')}`)
    .join(';');
}

// URL Serialization
function serializeSortToUrl(sort: SortItem[]): string {
  return sort.map((item) => `${item.field}:${item.order}`).join(',');
}
