import { IsDateString, IsOptional } from 'class-validator';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';

export class CreateMemberRequestDto extends CreateUserRequestDto {
  @IsDateString()
  @IsOptional()
  dateOfBirth: string | null;
}
