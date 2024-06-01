import { CreateMemberRequestDto } from '@adapters/controllers/member/create-member-request.dto';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useMutation } from '@adapters/ui/hooks/useMutation';
import { CreateMemberResponse } from '@application/members/use-cases/create-member/create-member.response';

export const useCreateMember = () =>
  useMutation<CreateMemberRequestDto, CreateMemberResponse>({
    methodName: MeteorMethodEnum.MembersCreate,
  });
