import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateUserRequestDto } from '@ui/dtos/create-user-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateUser = () =>
  useMutation<CreateUserRequestDto, null>({
    methodName: MeteorMethodEnum.UsersCreate,
  });
