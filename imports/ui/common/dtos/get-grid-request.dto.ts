import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
} from 'class-validator';

import { FindPaginatedRequest } from '@application/common/repositories/grid.repository';

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

  @IsObject()
  @IsDefined()
  public sorter!: GridSorter;
}
