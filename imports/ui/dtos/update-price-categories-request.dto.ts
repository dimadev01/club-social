import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdatePriceCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @IsInt()
  @IsPositive()
  public amount!: number;
}
