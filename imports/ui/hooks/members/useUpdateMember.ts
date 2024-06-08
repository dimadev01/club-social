import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { UpdateMemberRequestDto } from '@adapters/dtos/update-member-request.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateMember = () =>
  useMutation<UpdateMemberRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersUpdate,
  });
