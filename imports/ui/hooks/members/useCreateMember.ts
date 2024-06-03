import { CreateMemberResponse } from '@application/members/use-cases/create-member/crate-member.response';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateMemberRequest } from '@application/members/use-cases/create-member/create-member.request';
import { useMutation } from '@ui/hooks/useMutation';

export const useCreateMember = () =>
  useMutation<CreateMemberRequest, CreateMemberResponse>({
    methodName: MeteorMethodEnum.MembersCreate,
  });
