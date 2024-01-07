import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { CreateDueResponseDto } from '@domain/dues/use-cases/create-due/create-due-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useCreateDue = () =>
  useMutation<CreateDueResponseDto, Error, CreateDueRequestDto>(
    [MethodsEnum.DuesCreate],
    (request) => Meteor.callAsync(MethodsEnum.DuesCreate, request)
  );
