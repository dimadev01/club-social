import { IsNotEmpty, IsString } from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreateDueMember } from '@domain/dues/due.types';

export class DueMember {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  public static create(props: CreateDueMember): Result<DueMember, Error> {
    const dueMember = new DueMember();

    dueMember._id = props._id;

    dueMember.name = props.name;

    return ok(dueMember);
  }
}
