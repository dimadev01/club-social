import {
  PreviewBulkDuesDto,
  PreviewBulkDuesMemberDto,
  PreviewBulkDuesResultDto,
  PreviewBulkDuesSummaryDto,
} from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class PreviewBulkDuesMemberResponseDto implements PreviewBulkDuesMemberDto {
  public amount: number;
  public baseAmount: number;
  public discountPercent: number;
  public isGroupPricing: boolean;
  public memberCategory: MemberCategory;
  public memberId: string;
  public memberName: string;
}

export class PreviewBulkDuesRequestDto implements PreviewBulkDuesDto {
  @IsEnum(MemberCategory)
  @IsNotEmpty()
  public memberCategory: MemberCategory;
}

export class PreviewBulkDuesResponseDto implements PreviewBulkDuesResultDto {
  public members: PreviewBulkDuesMemberResponseDto[];
  public summary: PreviewBulkDuesSummaryResponseDto;
}

export class PreviewBulkDuesSummaryResponseDto implements PreviewBulkDuesSummaryDto {
  public totalAmount: number;
  public totalMembers: number;
}
