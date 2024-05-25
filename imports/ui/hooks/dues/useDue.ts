import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueResponseDto } from '@domain/dues/use-cases/get-due/get-due-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useDue = (id?: string) =>
  useQuery<GetDueRequestDto, Error, GetDueResponseDto | undefined>(
    [MethodsEnum.DuesGet, id],
    () => Meteor.callAsync(MethodsEnum.DuesGet, { id }),
    { enabled: !!id },
  );
