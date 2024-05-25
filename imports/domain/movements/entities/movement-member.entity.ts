import { IsString } from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreateMovementMember } from '@domain/movements/movement.types';

export class MovementMember {
  @IsString()
  public _id: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  public constructor() {
    this._id = '';

    this.firstName = '';

    this.lastName = '';
  }

  public get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public static create(
    props: CreateMovementMember,
  ): Result<MovementMember, Error> {
    const member = new MovementMember();

    member._id = props._id;

    member.firstName = props.firstName;

    member.lastName = props.lastName;

    return ok(member);
  }
}
