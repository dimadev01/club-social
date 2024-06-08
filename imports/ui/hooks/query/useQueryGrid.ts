import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { GetGridResponseDto } from '@adapters/common/dtos/get-grid-response.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

interface UseQueryGridProps<TRequest extends GetGridRequestDto> {
  methodName: MeteorMethodEnum;
  request: TRequest;
}

export function useQueryGrid<
  TRequest extends GetGridRequestDto,
  TDto,
  TResponse extends GetGridResponseDto<TDto> = GetGridResponseDto<TDto>,
>({ methodName, request }: UseQueryGridProps<TRequest>) {
  return useQuery<TRequest, TResponse>({
    keepPreviousData: true,
    methodName,
    request,
  });
}
