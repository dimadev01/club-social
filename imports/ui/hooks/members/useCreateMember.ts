import { CreateMemberResponse } from '@domain/members/use-cases/create-member/create-member.response';
import { CreateMemberRequestDto } from '@infra/controllers/types/create-member-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useCreateMember = () =>
  useMutation<CreateMemberRequestDto, CreateMemberResponse>({
    methodName: MeteorMethodEnum.MembersCreate,
  });
