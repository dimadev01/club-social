import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@shared/class-validator/is-nullable';

export type GridSorter = Record<string, 'ascend' | 'descend'>;

export type GridFilter = Record<string, string[]>;

export class GetGridRequestDto {
  @IsPositive()
  @IsNotEmpty()
  public page!: number;

  @IsPositive()
  @IsNotEmpty()
  public pageSize!: number;

  @IsNullable()
  @IsString()
  @IsDefined()
  public search!: string | null;

  @IsObject()
  @IsDefined()
  public sorter!: GridSorter;

  @IsObject()
  @IsNullable()
  @IsDefined()
  public filters!: GridFilter | null;
}
