import { Result, err, ok } from 'neverthrow';

import {
  CreateMemberAddress,
  IMemberAddress,
} from '@domain/members/member.interface';

export class MemberAddress implements IMemberAddress {
  private _cityGovId: string | null;

  private _cityName: string | null;

  private _stateGovId: string | null;

  private _stateName: string | null;

  private _street: string | null;

  private _zipCode: string | null;

  public constructor(props?: IMemberAddress) {
    this._cityGovId = props?.cityGovId ?? null;

    this._cityName = props?.cityName ?? null;

    this._stateGovId = props?.stateGovId ?? null;

    this._stateName = props?.stateName ?? null;

    this._street = props?.street ?? null;

    this._zipCode = props?.zipCode ?? null;
  }

  public get cityGovId(): string | null {
    return this._cityGovId;
  }

  public get cityName(): string | null {
    return this._cityName;
  }

  public get stateGovId(): string | null {
    return this._stateGovId;
  }

  public get stateName(): string | null {
    return this._stateName;
  }

  public get street(): string | null {
    return this._street;
  }

  public get zipCode(): string | null {
    return this._zipCode;
  }

  public static createOne(
    props: CreateMemberAddress,
  ): Result<MemberAddress, Error> {
    const address = new MemberAddress();

    const result = Result.combine([
      address.setCityGovId(props.cityGovId),
      address.setCityName(props.cityName),
      address.setStateGovId(props.stateGovId),
      address.setStateName(props.stateName),
      address.setStreet(props.street),
      address.setZipCode(props.zipCode),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(address);
  }

  private setCityGovId(value: string | null): Result<null, Error> {
    this._cityGovId = value;

    return ok(null);
  }

  private setCityName(value: string | null): Result<null, Error> {
    this._cityName = value;

    return ok(null);
  }

  private setStateGovId(value: string | null): Result<null, Error> {
    this._stateGovId = value;

    return ok(null);
  }

  private setStateName(value: string | null): Result<null, Error> {
    this._stateName = value;

    return ok(null);
  }

  private setStreet(value: string | null): Result<null, Error> {
    this._street = value;

    return ok(null);
  }

  private setZipCode(value: string | null): Result<null, Error> {
    this._zipCode = value;

    return ok(null);
  }
}
