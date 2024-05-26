import { IsDateString, IsOptional } from 'class-validator';

import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';

export class GetMemberDuesGridRequestDto extends PaginatedRequestDto {
  @IsDateString()
  @IsOptional()
  public from: string | null;

  @IsDateString()
  @IsOptional()
  public to: string | null;
}
