import { IsString } from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreateMovementMember } from '@domain/movements/movements.types';

export class MovementMember {
  // #region Properties (3)

  @IsString()
  public _id: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  // #endregion Properties (3)

  // #region Constructors (1)

  public constructor() {
    this._id = '';

    this.firstName = '';

    this.lastName = '';
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public static create(
    props: CreateMovementMember
  ): Result<MovementMember, Error> {
    const member = new MovementMember();

    member._id = props._id;

    member.firstName = props.firstName;

    member.lastName = props.lastName;

    return ok(member);
  }

  // #endregion Public Accessors (1)
}
