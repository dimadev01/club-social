import { useMutation as mutation } from '@tanstack/react-query';

import { MeteorError } from '@infra/meteor/errors/meteor-error';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';

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
