import { IsOptional, IsString } from 'class-validator';

export class MemberAddressEntityNewV {
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

  public constructor(props: MemberAddressEntityNewV) {
    this.cityName = props.cityName;

    this.cityGovId = props.cityGovId;

    this.stateName = props.stateName;

    this.stateGovId = props.stateGovId;

    this.street = props.street;

    this.zipCode = props.zipCode;
  }
}
