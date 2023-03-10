import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

export class GetMovementsGridRequestDto extends PaginatedRequestDto {
  @IsString()
  @IsOptional()
  public memberId: string | null;

  @IsDateString()
  @IsOptional()
  public from: string | null;

  @IsDateString()
  @IsOptional()
  public to: string | null;
}
