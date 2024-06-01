import { UpdateMemberRequestDto } from '@infra/controllers/types/update-member-request.dto';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useMutation } from '@adapters/ui/hooks/useMutation';

export const useUpdateMember = () =>
  useMutation<UpdateMemberRequestDto, null>({
    methodName: MeteorMethodEnum.MembersUpdate,
  });
