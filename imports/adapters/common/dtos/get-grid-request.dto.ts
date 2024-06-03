import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
} from 'class-validator';

import { GetGridRequest } from '@application/common/requests/get-grid.request';

export type GridFilter = Record<string, string[] | undefined>;

export type GridSorter = Record<string, 'ascend' | 'descend'>;

export class GetGridRequestDto implements GetGridRequest {
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
