import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useQuery } from '@adapters/ui/hooks/useQuery';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';

interface UseQueryGridProps<TRequest extends GetGridRequestDto> {
  methodName: MeteorMethodEnum;
  request: TRequest;
}

export function useQueryGrid<
  TResponseDto,
  TResponse extends
    FindPaginatedResponse<TResponseDto> = FindPaginatedResponse<TResponseDto>,
  TRequest extends GetGridRequestDto = GetGridRequestDto,
>({ methodName, request }: UseQueryGridProps<TRequest>) {
  return useQuery<TRequest, TResponse>({
    keepPreviousData: true,
    methodName,
    request,
  });
}
