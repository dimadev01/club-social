import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { CreateMemberResponse } from '@domain/members/use-cases/create-member-new/create-member.response';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useCreateMemberNew = () =>
  useMutation<CreateMemberRequestDto, CreateMemberResponse>({
    methodName: MethodsEnum.MembersCreateNew,
  });
