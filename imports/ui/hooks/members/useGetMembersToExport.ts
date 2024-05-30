import { GetMemberGridResponse } from '@domain/members/use-cases/get-member/get-member-grid.response';
import { GetMembersGridRequestDto } from '@infra/controllers/types/get-members-grid-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useMembersToExport = () =>
  useMutation<GetMembersGridRequestDto, GetMemberGridResponse[]>({
    methodName: MeteorMethodEnum.MembersGetToExport,
  });
