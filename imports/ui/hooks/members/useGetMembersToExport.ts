import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMembersGridRequest } from '@application/members/use-cases/ger-members-grid/get-members-grid.request';
import { GetMembersGridResponse } from '@application/members/use-cases/ger-members-grid/get-members-grid.response';
import { useMutation } from '@ui/hooks/useMutation';

export const useMembersToExport = () =>
  useMutation<GetMembersGridRequest, GetMembersGridResponse>({
    methodName: MeteorMethodEnum.MembersGetToExport,
  });
