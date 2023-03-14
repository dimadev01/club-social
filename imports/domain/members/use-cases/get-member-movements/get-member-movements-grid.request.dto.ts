import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

export class GetMemberMovementsGridRequestDto extends PaginatedRequestDto {
  @IsDateString()
  @IsOptional()
  public from: string | null;

  @IsDateString()
  @IsOptional()
  public to: string | null;

  @IsString()
  @IsNotEmpty()
  public memberId: string;
}
