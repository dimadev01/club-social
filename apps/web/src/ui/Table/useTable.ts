import { useState } from 'react';

interface TableStatus {
  page: number;
  pageSize: number;
}

export function useTable() {
  const [tableStatus, setTableStatus] = useState<TableStatus>({
    page: 1,
    pageSize: 20,
  });

  return {
    setTableStatus,
    tableStatus,
  };
}
