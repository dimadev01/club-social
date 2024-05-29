import { useMutation } from '@tanstack/react-query';

import { DeleteDueRequestDto } from '@domain/dues/use-cases/delete-due/delete-due-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useDeleteDue = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteDueRequestDto>(
    [MeteorMethodEnum.DuesDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.DuesDelete, request),
    { onSuccess: () => onSuccess() },
  );
