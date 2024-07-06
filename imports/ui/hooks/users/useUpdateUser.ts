import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { UpdateUserRequestDto } from '@ui/dtos/update-user-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateUser = () =>
  useMutation<UpdateUserRequestDto, null>({
    methodName: MeteorMethodEnum.UsersUpdate,
  });
