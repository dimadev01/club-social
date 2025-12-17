import type { TableProps } from 'antd';
import type { SorterResult as AntSorter } from 'antd/es/table/interface';

import { useState } from 'react';
import { type URLSearchParamsInit, useSearchParams } from 'react-router';

interface TableParams<T> {
  defaultFilters?: Record<string, string[]>;
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSort?: AntSorter<T>[];
}

interface TableState<T> {
  filters?: Record<string, string[]>;
  page: number;
  pageSize: number;
  queryFilters?: Record<string, string[]>;
  querySort: Record<string, string>;
  sort: AntSorter<T>[];
}

export function useTable<T>({
  defaultFilters,
  defaultPage = 1,
  defaultPageSize = 20,
  defaultSort = [],
}: TableParams<T> = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort =
    searchParams
      .get('sort')
      ?.split(',')
      .map((item) => {
        const [field, order] = item.split(':');

        return { field, order } as AntSorter<T>;
      }) ?? defaultSort;

  const filters =
    searchParams
      .get('filters')
      ?.split(';')
      .reduce<Record<string, string[]>>((acc, item) => {
        const [key, value] = item.split(':');

        acc[key] = value.split(',');

        return acc;
      }, {}) ?? defaultFilters;

  const [status, setStatus] = useState<TableState<T>>({
    filters,
    page: Number(searchParams.get('page')) || defaultPage,
    pageSize: Number(searchParams.get('pageSize')) || defaultPageSize,
    queryFilters: serializeFilters(filters),
    querySort: serializeSort(sort),
    sort,
  });

  console.log(status);

  const onChange: TableProps<T>['onChange'] = (pagination, filters, sorter) => {
    console.log(filters);

    const normalizedSorter = Array.isArray(sorter) ? sorter : [sorter];
    const normalizedFilters = Object.entries(filters).reduce<
      Record<string, string[]>
    >((acc, [key, value]) => {
      if (value === null) {
        return acc;
      }

      acc[key] = value.map(String);

      return acc;
    }, {});

    const normalizedFiltersEmpty = Object.keys(normalizedFilters).length === 0;

    const params: URLSearchParamsInit = {
      page: String(status.page),
      pageSize: String(status.pageSize),
      sort: normalizedSorter
        .map((item) => `${item.field}:${item.order}`)
        .join(','),
      ...normalizedFilters,
    };

    if (!normalizedFiltersEmpty) {
      params.filters = Object.entries(normalizedFilters)
        .map(([key, value]) => `${key}:${value.join(',')}`)
        .join(';');
    }

    setSearchParams(params);

    setStatus({
      filters: normalizedFilters,
      page: Number(pagination.current),
      pageSize: Number(pagination.pageSize),
      queryFilters: serializeFilters(normalizedFilters),
      querySort: serializeSort(normalizedSorter),
      sort: normalizedSorter,
    });
  };

  return { onChange, status };
}

function serializeFilters(filters?: Record<string, string[]>) {
  if (!filters) {
    return undefined;
  }

  return Object.entries(filters).reduce<Record<string, string[]>>(
    (acc, [key, value]) => {
      if (value === null) {
        return acc;
      }

      acc[`filters[${key}]`] = value;

      return acc;
    },
    {},
  );
}

function serializeSort<T>(sort: AntSorter<T>[]) {
  return sort.reduce<Record<string, string>>((acc, s, i) => {
    acc[`sort[${i}][field]`] = String(s.field);
    acc[`sort[${i}][order]`] = String(s.order);

    return acc;
  }, {});
}
