import { GetServicesResponseDto } from '@domain/services/use-cases/get-services/get-services-response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useServices = (enabled = true) =>
  useQuery<undefined, Error, GetServicesResponseDto[]>(
    [MethodsEnum.ServicesGetAll],
    () => Meteor.callAsync(MethodsEnum.ServicesGetAll),
    { enabled }
  );
