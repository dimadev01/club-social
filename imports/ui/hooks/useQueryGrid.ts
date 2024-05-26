import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { UrlUtils } from '@shared/utils/url.utils';

export function useQueryGrid<TRequest, TResponse>(
  methodName: string,
  request: TRequest,
) {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<TRequest, Error, TResponse>(
    [methodName, request],
    () => Meteor.callAsync(methodName, request),
    { keepPreviousData: true },
  );
}
