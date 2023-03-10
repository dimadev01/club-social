import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useProfessors = (enabled = true) =>
  useQuery<undefined, Error, GetProfessorsResponseDto[]>(
    [MethodsEnum.ProfessorsGetAll],
    () => Meteor.callAsync(MethodsEnum.ProfessorsGetAll),
    { enabled }
  );
