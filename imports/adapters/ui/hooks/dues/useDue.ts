import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueResponseDto } from '@domain/dues/use-cases/get-due/get-due-response.dto';

export const useDue = (id?: string) =>
  useQuery<GetDueRequestDto, Error, GetDueResponseDto | undefined>(
    [MeteorMethodEnum.DuesGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.DuesGet, { id }),
    { enabled: !!id },
  );
