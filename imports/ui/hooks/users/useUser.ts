import { UserDto } from '@application/users/dtos/user.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useUser = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, UserDto>({
    methodName: MeteorMethodEnum.UsersGetOne,
    request,
  });
