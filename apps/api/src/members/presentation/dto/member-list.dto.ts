import { UserStatus } from '@club-social/shared/users';

export class MemberListDto {
  public id: string;
  public name: string;
  public status: UserStatus;
}
