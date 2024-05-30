import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { GetGridResponse } from '@infra/controllers/types/get-grid-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

interface UseQueryGridProps<TRequest extends GetGridRequestDto> {
  methodName: MeteorMethodEnum;
  request: TRequest;
}

export function useQueryGrid<
  TResponse,
  TRequest extends GetGridRequestDto = GetGridRequestDto,
>({ methodName, request }: UseQueryGridProps<TRequest>) {
  return useQuery<TRequest, GetGridResponse<TResponse>>({
    keepPreviousData: true,
    methodName,
    request,
  });
}
