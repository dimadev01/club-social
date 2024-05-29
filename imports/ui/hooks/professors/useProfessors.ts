import { useQuery } from '@tanstack/react-query';

import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useProfessors = (enabled = true) =>
  useQuery<null, Error, GetProfessorsResponseDto[]>(
    [MeteorMethodEnum.ProfessorsGetAll],
    () => Meteor.callAsync(MeteorMethodEnum.ProfessorsGetAll),
    { enabled },
  );
