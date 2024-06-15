import { MemberDto } from '@application/members/dtos/member.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { UpdateMemberRequestDto } from '@ui/dtos/update-member-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateMember = () =>
  useMutation<UpdateMemberRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersUpdate,
  });
