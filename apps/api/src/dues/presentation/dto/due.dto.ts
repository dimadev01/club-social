import { DueCategory, DueDto, DueStatus } from '@club-social/shared/dues';

export class DueResponseDto implements DueDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public memberId: string;
  public notes: null | string;
  public status: DueStatus;
  public updatedAt: string;
  public updatedBy: null | string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
