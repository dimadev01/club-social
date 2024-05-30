import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

import { FindPaginatedRequest } from '@domain/common/repositories/queryable-grid-repository.interface';
import { IsNullable } from '@shared/class-validator/is-nullable';

export type GridFilter = Record<string, string[]>;

export type GridSorter = Record<string, 'ascend' | 'descend'>;

export class GetGridRequestDto implements FindPaginatedRequest {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public limit!: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  public page!: number;

  @IsNullable()
  @IsString()
  @IsDefined()
  public search!: string | null;

  @IsObject()
  @IsDefined()
  public sorter!: GridSorter;
}
