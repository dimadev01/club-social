import {
  DueCategory,
  DueStatus,
  IDueDetailDto,
} from '@club-social/shared/dues';
import { UserStatus } from '@club-social/shared/users';

export class DueDetailDto implements IDueDetailDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public date: string;
  public id: string;
  public memberId: string;
  public memberName: string;
  public notes: null | string;
  public status: DueStatus;
  public userStatus: UserStatus;
}
