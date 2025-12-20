import { DueCategory, DueStatus, IPendingDto } from '@club-social/shared/dues';

export class PendingDueDto implements IPendingDto {
  public amount: number;
  public category: DueCategory;
  public date: string;
  public id: string;
  public status: DueStatus;
}
