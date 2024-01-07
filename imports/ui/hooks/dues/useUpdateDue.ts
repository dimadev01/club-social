import { UpdateDueRequestDto } from '@domain/dues/use-cases/update-due/update-due-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateDue = () =>
  useMutation<null, Error, UpdateDueRequestDto>(
    [MethodsEnum.DuesUpdate],
    (request) => Meteor.callAsync(MethodsEnum.DuesUpdate, request)
  );
