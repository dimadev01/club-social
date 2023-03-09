import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

export class GetMovementsGridRequestDto extends PaginatedRequestDto {
  @IsString()
  @IsOptional()
  public memberId: string | null;

  @IsArray()
  public amountFilter: [number, number];

  @IsDateString()
  @IsOptional()
  public from: string | null;

  @IsDateString()
  @IsOptional()
  public to: string | null;
}
