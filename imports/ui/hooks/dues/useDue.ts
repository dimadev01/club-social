import { useQuery } from '@tanstack/react-query';

import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueResponseDto } from '@domain/dues/use-cases/get-due/get-due-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useDue = (id?: string) =>
  useQuery<GetDueRequestDto, Error, GetDueResponseDto | undefined>(
    [MeteorMethodEnum.DuesGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.DuesGet, { id }),
    { enabled: !!id },
  );
