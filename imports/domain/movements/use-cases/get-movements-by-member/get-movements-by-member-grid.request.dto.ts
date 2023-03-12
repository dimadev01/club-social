import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

export class GetMovementsByMemberGridRequestDto extends PaginatedRequestDto {
  @IsString()
  public memberId: string;

  @IsDateString()
  @IsOptional()
  public from: string | null;

  @IsDateString()
  @IsOptional()
  public to: string | null;
}
