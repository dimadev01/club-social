import { CreateMemberRequestDto } from '@adapters/controllers/member/create-member-request.dto';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { CreateMemberResponse } from '@application/members/use-cases/create-member/create-member.response';
import { useMutation } from '@ui/hooks/useMutation';

export const useCreateMember = () =>
  useMutation<CreateMemberRequestDto, CreateMemberResponse>({
    methodName: MeteorMethodEnum.MembersCreate,
  });
