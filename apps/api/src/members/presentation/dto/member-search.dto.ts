import { UserStatus } from '@club-social/shared/users';

export class MemberSearchDto {
  public email: string;
  public id: string;
  public name: string;
  public status: UserStatus;
}
