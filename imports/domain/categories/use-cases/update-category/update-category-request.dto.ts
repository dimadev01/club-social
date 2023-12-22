import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsInt()
  @IsOptional()
  amount: number | null;
}
