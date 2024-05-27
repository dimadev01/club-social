import { Result, ok } from 'neverthrow';

import { CreateMemberAddress } from '@domain/members/member.types';
import { IMemberAddressModel } from '@domain/members/models/member-model.interface';

export class MemberAddressModel implements IMemberAddressModel {
  public cityGovId: string | null;

  public cityName: string | null;

  public stateGovId: string | null;

  public stateName: string | null;

  public street: string | null;

  public zipCode: string | null;

  public constructor(props?: IMemberAddressModel) {
    this.cityGovId = props?.cityGovId ?? null;

    this.cityName = props?.cityName ?? null;

    this.stateGovId = props?.stateGovId ?? null;

    this.stateName = props?.stateName ?? null;

    this.street = props?.street ?? null;

    this.zipCode = props?.zipCode ?? null;
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
