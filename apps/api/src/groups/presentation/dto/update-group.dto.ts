import { UpdateGroupDto } from '@club-social/shared/groups';
import { ArrayMinSize, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateGroupRequestDto implements UpdateGroupDto {
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  public memberIds: string[];

  @IsNotEmpty()
  @IsString()
  public name: string;
}
