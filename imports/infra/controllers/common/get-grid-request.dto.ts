import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
} from 'class-validator';

import { FindPaginatedRequestNewV } from '@domain/common/repositories/queryable-grid-repository.interface';

export type GridFilter = Record<string, string[]>;

export type GridSorter = Record<string, 'ascend' | 'descend'>;

export class GetGridRequestDto implements FindPaginatedRequestNewV {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public limit!: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  public page!: number;

  @IsObject()
  @IsDefined()
  public sorter!: GridSorter;
}
