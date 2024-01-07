import { IsNotEmpty, IsString } from 'class-validator';

export class GetCategoryRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
