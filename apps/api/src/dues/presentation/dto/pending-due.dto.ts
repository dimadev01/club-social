import {
  DueCategory,
  DueStatus,
  PendingDueDto,
} from '@club-social/shared/dues';

export class PendingDueResponseDto implements PendingDueDto {
  public amount: number;
  public category: DueCategory;
  public date: string;
  public id: string;
  public status: DueStatus;
}
