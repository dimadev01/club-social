import { useSearchParams } from 'react-router';

interface TableParams {
  defaultPage?: number;
  defaultPageSize?: number;
}

interface TableStatus {
  page: number;
  pageSize: number;
}

export function useTable({
  defaultPage = 1,
  defaultPageSize = 20,
}: TableParams = {}) {
  const [searchParams, setSearchParams] = useSearchParams({
    page: String(defaultPage),
    pageSize: String(defaultPageSize),
  });

  const page = Number(searchParams.get('page')) || defaultPage;
  const pageSize = Number(searchParams.get('pageSize')) || defaultPageSize;

  const onChange = (page: number, pageSize: number) => {
    setSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
  };

  const state: TableStatus = {
    page,
    pageSize,
  };

  return { onChange, state };
}
