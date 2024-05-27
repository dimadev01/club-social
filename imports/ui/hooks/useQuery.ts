import { useQuery as uq } from '@tanstack/react-query';

import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { MeteorError } from '@infra/meteor/errors/meteor-error';

interface UseQueryProps<TRequest> {
  methodName: MethodsEnum;
  request?: TRequest;
}

export function useQuery<TRequest, TResponse>({
  methodName,
  request,
}: UseQueryProps<TRequest>) {
  return uq<TRequest, MeteorError, TResponse>({
    enabled: !!request,
    queryFn: Meteor.callAsync(methodName, request),
    queryKey: [methodName, request],
  });
}
