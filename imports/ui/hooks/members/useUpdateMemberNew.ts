import { UpdateMemberRequestDto } from '@infra/controllers/types/update-member-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useUpdateMember = () =>
  useMutation<UpdateMemberRequestDto, null>({
    methodName: MeteorMethodEnum.MembersUpdate,
  });
