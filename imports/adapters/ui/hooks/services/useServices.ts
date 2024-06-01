import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetServicesResponseDto } from '@domain/services/use-cases/get-services/get-services-response.dto';

export const useServices = (enabled = true) =>
  useQuery<null, Error, GetServicesResponseDto[]>(
    [MeteorMethodEnum.ServicesGetAll],
    () => Meteor.callAsync(MeteorMethodEnum.ServicesGetAll),
    { enabled },
  );
