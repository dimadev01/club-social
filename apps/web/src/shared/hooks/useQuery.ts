import {
  type DefaultError,
  type QueryKey,
  type UseQueryOptions,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query';

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return useTanstackQuery(options);
}
