import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';

export const useProfessors = (enabled = true) =>
  useQuery<null, Error, GetProfessorsResponseDto[]>(
    [MeteorMethodEnum.ProfessorsGetAll],
    () => Meteor.callAsync(MeteorMethodEnum.ProfessorsGetAll),
    { enabled },
  );
