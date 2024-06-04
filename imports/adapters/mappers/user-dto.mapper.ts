import { singleton } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { UserDto } from '@application/users/dtos/user.dto';
import { User } from '@domain/users/models/user.model';

@singleton()
export class UserDtoMapper extends MapperDto<User, UserDto> {
  public toDto(user: User): UserDto {
    return {
      emails:
        user.emails?.map((email) => ({
          address: email.address,
          verified: email.verified,
        })) ?? [],
      firstName: user.firstName,
      id: user._id,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
