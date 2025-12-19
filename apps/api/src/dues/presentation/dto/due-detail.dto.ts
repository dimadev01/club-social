import {
  DueCategory,
  DueStatus,
  IDueDetailDto,
} from '@club-social/shared/dues';

export class DueDetailDto implements IDueDetailDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public date: string;
  public id: string;
  public memberId: string;
  public notes: null | string;
  public status: DueStatus;
}
