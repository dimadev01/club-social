import {
  type DefaultError,
  type UseQueryOptions,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query';

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
>(options: UseQueryOptions<TQueryFnData, TError, TData>) {
  return useTanstackQuery(options);
}
