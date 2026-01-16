import { CreateGroupDto } from '@club-social/shared/groups';
import { ArrayMinSize, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGroupRequestDto implements CreateGroupDto {
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  public memberIds: string[];

  @IsNotEmpty()
  @IsString()
  public name: string;
}
