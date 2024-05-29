import { useQuery as uq } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { MeteorError } from '@infra/meteor/errors/meteor-error';

interface UseQueryProps<TRequest> {
  keepPreviousData?: boolean;
  methodName: MeteorMethodEnum;
  request?: TRequest;
}

export function useQuery<TRequest, TResponse>({
  methodName,
  request,
  keepPreviousData,
}: UseQueryProps<TRequest>) {
  return uq<TRequest, MeteorError, TResponse>(
    [methodName, request],
    () => Meteor.callAsync(methodName, request),
    { enabled: !!request, keepPreviousData },
  );
}
