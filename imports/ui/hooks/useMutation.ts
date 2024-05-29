import { useMutation as mutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { MeteorError } from '@infra/meteor/errors/meteor-error';

interface UseMutationProps {
  methodName: MeteorMethodEnum;
}

export function useMutation<TRequest, TResponse>({
  methodName,
}: UseMutationProps) {
  return mutation<TResponse, MeteorError, TRequest>([methodName], (request) =>
    Meteor.callAsync(methodName, request),
  );
}
