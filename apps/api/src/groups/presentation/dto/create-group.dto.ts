import { CreateGroupDto } from '@club-social/shared/groups';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupRequestDto implements CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
