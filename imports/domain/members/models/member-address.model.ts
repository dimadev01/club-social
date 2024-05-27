import { Result, ok } from 'neverthrow';

import { CreateMemberAddress } from '@domain/members/member.types';
import { IMemberAddressModel } from '@domain/members/models/member-model.interface';

export class MemberAddressModel implements IMemberAddressModel {
  public cityGovId: string | null = null;

  public cityName: string | null = null;

  public stateGovId: string | null = null;

  public stateName: string | null = null;

  public street: string | null = null;

  public zipCode: string | null = null;

  public constructor(props?: IMemberAddressModel) {
    if (props) {
      this.cityGovId = props.cityGovId;

      this.cityName = props.cityName;

      this.stateGovId = props.stateGovId;

      this.stateName = props.stateName;

      this.street = props.street;

      this.zipCode = props.zipCode;
    }
  }

  public static createOne(
    props: CreateMemberAddress,
  ): Result<MemberAddressModel, Error> {
    const memberAddress = new MemberAddressModel();

    memberAddress.cityGovId = props.cityGovId;

    memberAddress.cityName = props.cityName;

    memberAddress.stateGovId = props.stateGovId;

    memberAddress.stateName = props.stateName;

    memberAddress.street = props.street;

    memberAddress.zipCode = props.zipCode;

    return ok(memberAddress);
  }
}
