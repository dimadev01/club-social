import { IsNotEmpty, IsString } from 'class-validator';

export class GetCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
