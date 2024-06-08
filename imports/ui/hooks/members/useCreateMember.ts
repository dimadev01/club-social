import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateMemberRequestDto } from '@adapters/dtos/create-member-request.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateMember = () =>
  useMutation<CreateMemberRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersCreate,
  });
