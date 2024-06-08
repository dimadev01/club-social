import { useQuery as uq } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MeteorError } from '@infra/meteor/errors/meteor-error';

interface UseQueryProps<TRequest> {
  enabled?: boolean;
  keepPreviousData?: boolean;
  methodName: MeteorMethodEnum;
  request?: TRequest;
}

export function useQuery<TRequest, TResponse>({
  methodName,
  request,
  keepPreviousData = false,
  enabled = !!request,
}: UseQueryProps<TRequest>) {
  return uq<TRequest, MeteorError, TResponse>(
    [methodName, request],
    () => Meteor.callAsync(methodName, request),
    { enabled, keepPreviousData },
  );
}
