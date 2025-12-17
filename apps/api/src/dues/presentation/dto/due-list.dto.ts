import { DueCategory, DueStatus } from '@club-social/shared/dues';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';

export class DueListRequestDto extends PaginatedRequestDto {
  @IsEnum(DueCategory)
  @IsOptional()
  public category?: DueCategory;

  @IsOptional()
  @IsString()
  @IsUUID()
  public memberId?: string;

  @IsEnum(DueStatus)
  @IsOptional()
  public status?: DueStatus;
}
