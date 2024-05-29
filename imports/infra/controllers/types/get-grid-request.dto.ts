import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@shared/class-validator/is-nullable';

export type GetGridSorter = Record<string, 'ascend' | 'descend' | null>;

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

  @IsNotEmptyObject()
  @IsObject()
  @IsDefined()
  public sorter!: GetGridSorter;

  @IsObject()
  @IsDefined()
  public filters!: Record<string, string[] | null>;
}
