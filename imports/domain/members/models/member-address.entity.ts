import { IsOptional, IsString } from 'class-validator';

export class MemberAddressModel {
  @IsString()
  @IsOptional()
  public cityName: string | null;

  @IsString()
  @IsOptional()
  public cityGovId: string | null;

  @IsString()
  @IsOptional()
  public stateName: string | null;

  @IsString()
  @IsOptional()
  public stateGovId: string | null;

  @IsString()
  @IsOptional()
  public street: string | null;

  @IsString()
  @IsOptional()
  public zipCode: string | null;

  public constructor() {
    this.cityGovId = null;

    this.cityName = null;

    this.stateGovId = null;

    this.stateName = null;

    this.street = null;

    this.zipCode = null;
  }
}
