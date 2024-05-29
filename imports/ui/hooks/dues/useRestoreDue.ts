import { useMutation } from '@tanstack/react-query';

import { RestoreDueRequestDto } from '@domain/dues/use-cases/restore-due/restore-due-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useRestoreDue = (onSuccess: () => void) =>
  useMutation<null, Error, RestoreDueRequestDto>(
    [MeteorMethodEnum.DuesRestore],
    (request) => Meteor.callAsync(MeteorMethodEnum.DuesRestore, request),
    { onSuccess: () => onSuccess() },
  );
