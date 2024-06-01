import { Result, err, ok } from 'neverthrow';

import { CreateMemberAddressOld } from '@domain/members/member.types';
import { IMemberAddressModel } from '@domain/members/models/member-model.interface';

export class MemberAddressModel implements IMemberAddressModel {
  private _cityGovId: string | null;

  private _cityName: string | null;

  private _stateGovId: string | null;

  private _stateName: string | null;

  private _street: string | null;

  private _zipCode: string | null;

  public constructor(props?: IMemberAddressModel) {
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
    props: CreateMemberAddressOld,
  ): Result<MemberAddressModel, Error> {
    const address = new MemberAddressModel();

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

  public setCityGovId(value: string | null): Result<null, Error> {
    this._cityGovId = value;

    return ok(null);
  }

  public setCityName(value: string | null): Result<null, Error> {
    this._cityName = value;

    return ok(null);
  }

  public setStateGovId(value: string | null): Result<null, Error> {
    this._stateGovId = value;

    return ok(null);
  }

  public setStateName(value: string | null): Result<null, Error> {
    this._stateName = value;

    return ok(null);
  }

  public setStreet(value: string | null): Result<null, Error> {
    this._street = value;

    return ok(null);
  }

  public setZipCode(value: string | null): Result<null, Error> {
    this._zipCode = value;

    return ok(null);
  }
}
