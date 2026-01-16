import { UpdateGroupDto } from '@club-social/shared/groups';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UpdateGroupRequestDto implements UpdateGroupDto {
  @IsInt()
  @Max(100)
  @Min(0)
  public discountPercent: number;

  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  public memberIds: string[];

  @IsNotEmpty()
  @IsString()
  public name: string;
}
