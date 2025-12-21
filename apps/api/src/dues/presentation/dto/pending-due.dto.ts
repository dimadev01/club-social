import {
  DueCategory,
  DueStatus,
  IPendingDueDto,
} from '@club-social/shared/dues';

export class PendingDueDto implements IPendingDueDto {
  public amount: number;
  public category: DueCategory;
  public date: string;
  public id: string;
  public status: DueStatus;
}
