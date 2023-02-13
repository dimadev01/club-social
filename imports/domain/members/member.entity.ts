import { ok, Result } from 'neverthrow';
import { Entity } from '@domain/members/entity.base';
import { CreateMember } from '@domain/members/members.types';

export class Member extends Entity {
  dateOfBirth: Date;

  userId: string;

  private constructor() {
    super();
  }

  public static create(props: CreateMember): Result<Member, Error> {
    const member = new Member();

    member.dateOfBirth = new Date(props.dateOfBirth);

    member.userId = props.userId;

    return ok(member);
  }
}
