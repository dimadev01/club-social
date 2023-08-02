import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsInt()
  @IsOptional()
  amount: number | null;
}
