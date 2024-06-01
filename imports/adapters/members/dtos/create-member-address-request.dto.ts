import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

import { CreateMemberAddress } from '@domain/members/models/member-model.interface';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class CreateMemberAddressRequestDto implements CreateMemberAddress {
  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public cityGovId!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public cityName!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public stateGovId!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public stateName!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public street!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public zipCode!: string | null;
}
