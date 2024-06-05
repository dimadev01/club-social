import { UpdateMemberResponse } from '@application/members/use-cases/update-member/update-member.response';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { UpdateMemberRequest } from '@application/members/use-cases/update-member/update-member.request';
import { useMutation } from '@ui/hooks/useMutation';

export const useUpdateMember = () =>
  useMutation<UpdateMemberRequest, UpdateMemberResponse>({
    methodName: MeteorMethodEnum.MembersUpdate,
  });
