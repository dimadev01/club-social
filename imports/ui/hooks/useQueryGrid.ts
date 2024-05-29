import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { GetGridResponse } from '@infra/controllers/types/get-grid-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@ui/hooks/useQuery';

interface UseQueryGridProps<TRequest extends GetGridRequestDto> {
  methodName: MeteorMethodEnum;
  request: TRequest;
}

export function useQueryGrid<
  TResponse,
  TRequest extends GetGridRequestDto = GetGridRequestDto,
>({ methodName, request }: UseQueryGridProps<TRequest>) {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<TRequest, GetGridResponse<TResponse>>({
    keepPreviousData: true,
    methodName,
    request,
  });
}
