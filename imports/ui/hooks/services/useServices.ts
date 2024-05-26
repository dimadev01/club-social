import { useQuery } from '@tanstack/react-query';

import { GetServicesResponseDto } from '@domain/services/use-cases/get-services/get-services-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useServices = (enabled = true) =>
  useQuery<null, Error, GetServicesResponseDto[]>(
    [MethodsEnum.ServicesGetAll],
    () => Meteor.callAsync(MethodsEnum.ServicesGetAll),
    { enabled },
  );
