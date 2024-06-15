import { MemberDto } from '@application/members/dtos/member.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateMemberRequestDto } from '@ui/dtos/create-member-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateMember = () =>
  useMutation<CreateMemberRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersCreate,
  });
