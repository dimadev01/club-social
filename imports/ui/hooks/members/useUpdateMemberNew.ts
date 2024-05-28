import { UpdateMemberRequestDto } from '@infra/controllers/types/update-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useUpdateMemberNew = () =>
  useMutation<UpdateMemberRequestDto, null>({
    methodName: MethodsEnum.MembersUpdateNew,
  });
