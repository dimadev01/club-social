import { IMemberDetailIAddressDto } from '@club-social/shared/members';

export class MemberDetailAddressDto implements IMemberDetailIAddressDto {
  public birthDate: null | string;
  public cityName: null | string;
  public stateName: null | string;
  public street: null | string;
  public zipCode: null | string;
}
