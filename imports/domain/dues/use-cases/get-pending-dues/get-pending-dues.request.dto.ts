import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class GetPendingDuesRequestDto {
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  public memberIds: string[];
}
