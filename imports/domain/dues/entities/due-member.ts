import { IsNotEmpty, IsString } from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreateDueMember } from '@domain/dues/due.types';

export class DueMember {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  public get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public static create(props: CreateDueMember): Result<DueMember, Error> {
    const dueMember = new DueMember();

    dueMember._id = props._id;

    dueMember.firstName = props.firstName;

    dueMember.lastName = props.lastName;

    return ok(dueMember);
  }
}
