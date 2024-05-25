import { DeleteDueRequestDto } from '@domain/dues/use-cases/delete-due/delete-due-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useDeleteDue = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteDueRequestDto>(
    [MethodsEnum.DuesDelete],
    (request) => Meteor.callAsync(MethodsEnum.DuesDelete, request),
    { onSuccess: () => onSuccess() },
  );
