import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';

export class OldGetMovementsGridRequestDto extends PaginatedRequestDto {
  @IsArray()
  @IsString({ each: true })
  public memberIds: string[];

  @IsDateString()
  @IsOptional()
  public from: string | null;

  @IsDateString()
  @IsOptional()
  public to: string | null;

  @IsBoolean()
  @IsOptional()
  public showDeleted: boolean | null;

  @IsNotEmpty()
  @IsString()
  public sortField: 'createdAt';
}
