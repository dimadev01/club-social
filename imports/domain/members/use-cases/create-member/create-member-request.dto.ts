import { IsDateString } from 'class-validator';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';

export class CreateMemberRequestDto extends CreateUserRequestDto {
  @IsDateString()
  dateOfBirth: string;
}
