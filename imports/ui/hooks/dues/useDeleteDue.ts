import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { DeleteDueRequestDto } from '@domain/dues/use-cases/delete-due/delete-due-request.dto';

export const useDeleteDue = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteDueRequestDto>(
    [MeteorMethodEnum.DuesDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.DuesDelete, request),
    { onSuccess: () => onSuccess() },
  );
