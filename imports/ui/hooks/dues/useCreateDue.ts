import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { CreateDueResponseDto } from '@domain/dues/use-cases/create-due/create-due-response.dto';

export const useCreateDue = () =>
  useMutation<CreateDueResponseDto, Error, CreateDueRequestDto>(
    [MeteorMethodEnum.DuesCreate],
    (request) => Meteor.callAsync(MeteorMethodEnum.DuesCreate, request),
  );
