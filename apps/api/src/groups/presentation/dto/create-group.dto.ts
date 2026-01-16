import { CreateGroupDto } from '@club-social/shared/groups';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateGroupRequestDto implements CreateGroupDto {
  @IsInt()
  @Max(99)
  @Min(0)
  public discountPercent: number;

  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  public memberIds: string[];

  @IsNotEmpty()
  @IsString()
  public name: string;
}
