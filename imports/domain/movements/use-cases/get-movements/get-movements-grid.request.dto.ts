import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

export class GetMovementsGridRequestDto extends PaginatedRequestDto {
  @IsString()
  @IsOptional()
  public memberId: string | null;

  @IsEnum(CategoryEnum)
  @IsOptional()
  public category: CategoryEnum | null;

  @IsArray()
  public amountFilter: [number, number];
}
