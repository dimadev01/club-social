import { FindPaginatedResponseNewV } from '@domain/common/repositories/queryable-grid-repository.interface';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

interface UseQueryGridProps<TRequest extends GetGridRequestDto> {
  methodName: MeteorMethodEnum;
  request: TRequest;
}

export function useQueryGrid<
  TResponseDto,
  TResponse extends
    FindPaginatedResponseNewV<TResponseDto> = FindPaginatedResponseNewV<TResponseDto>,
  TRequest extends GetGridRequestDto = GetGridRequestDto,
>({ methodName, request }: UseQueryGridProps<TRequest>) {
  return useQuery<TRequest, TResponse>({
    keepPreviousData: true,
    methodName,
    request,
  });
}
