import { useMutation } from '@tanstack/react-query';

import { RestoreDueRequestDto } from '@domain/dues/use-cases/restore-due/restore-due-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useRestoreDue = (onSuccess: () => void) =>
  useMutation<null, Error, RestoreDueRequestDto>(
    [MethodsEnum.DuesRestore],
    (request) => Meteor.callAsync(MethodsEnum.DuesRestore, request),
    { onSuccess: () => onSuccess() },
  );
