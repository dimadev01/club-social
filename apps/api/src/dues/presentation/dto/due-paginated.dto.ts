import {
  DueCategory,
  DueStatus,
  IDuePaginatedDto,
} from '@club-social/shared/dues';
import { UserStatus } from '@club-social/shared/users';

export class DuePaginatedDto implements IDuePaginatedDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public date: string;
  public id: string;
  public memberId: string;
  public memberName: string;
  public status: DueStatus;
  public userStatus: UserStatus;
}
