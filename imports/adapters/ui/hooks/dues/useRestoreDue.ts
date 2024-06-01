import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { RestoreDueRequestDto } from '@domain/dues/use-cases/restore-due/restore-due-request.dto';

export const useRestoreDue = (onSuccess: () => void) =>
  useMutation<null, Error, RestoreDueRequestDto>(
    [MeteorMethodEnum.DuesRestore],
    (request) => Meteor.callAsync(MeteorMethodEnum.DuesRestore, request),
    { onSuccess: () => onSuccess() },
  );
