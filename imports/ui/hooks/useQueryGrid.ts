import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { useQuery } from '@ui/hooks/useQuery';

interface UseQueryGridProps<TRequest extends FindPaginatedRequest> {
  methodName: MeteorMethodEnum;
  request: TRequest;
}

export function useQueryGrid<
  TRequest extends FindPaginatedRequest,
  TResponse extends FindPaginatedResponse,
>({ methodName, request }: UseQueryGridProps<TRequest>) {
  return useQuery<TRequest, TResponse>({
    keepPreviousData: true,
    methodName,
    request,
  });
}
