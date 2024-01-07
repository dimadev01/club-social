import { PendingDueDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const usePendingDues = (request: GetPendingDuesRequestDto) =>
  useQuery<GetPendingDuesRequestDto, Error, PendingDueDto[]>(
    [MethodsEnum.DuesGetPending, request],
    () => Meteor.callAsync(MethodsEnum.DuesGetPending, request),
    { enabled: request.memberIds.length > 0 }
  );
