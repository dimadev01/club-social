import type { TableProps } from 'antd';
import type { SorterResult as AntSorter } from 'antd/es/table/interface';

import { useState } from 'react';
import { useSearchParams } from 'react-router';

interface TableParams<T> {
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSort?: AntSorter<T>[];
}

interface TableState<T> {
  page: number;
  pageSize: number;
  sort: AntSorter<T>[];
  sortSerialized: Record<string, string>;
}

export function useTable<T>({
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

  const [status, setStatus] = useState<TableState<T>>({
    page: Number(searchParams.get('page')) || defaultPage,
    pageSize: Number(searchParams.get('pageSize')) || defaultPageSize,
    sort,
    sortSerialized: serializeSort(sort),
  });

  const onChange: TableProps<T>['onChange'] = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);

    const normalizedSorter = Array.isArray(sorter) ? sorter : [sorter];

    setSearchParams({
      page: String(status.page),
      pageSize: String(status.pageSize),
      sort: normalizedSorter
        .map((item) => `${item.field}:${item.order}`)
        .join(','),
    });

    setStatus({
      page: Number(pagination.current),
      pageSize: Number(pagination.pageSize),
      sort: normalizedSorter,
      sortSerialized: serializeSort(normalizedSorter),
    });
  };

  return { onChange, status };
}

function serializeSort<T>(sort: AntSorter<T>[]) {
  return sort.reduce<Record<string, string>>((acc, s, i) => {
    acc[`sort[${i}][field]`] = String(s.field);
    acc[`sort[${i}][order]`] = String(s.order);

    return acc;
  }, {});
}
