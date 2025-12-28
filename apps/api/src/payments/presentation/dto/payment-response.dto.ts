import { DueCategory, DueSettlementStatus } from '@club-social/shared/dues';
import {
  PaymentDto,
  PaymentDueSettlementDto,
  PaymentDueSettlementDueDto,
  PaymentMemberDto,
  PaymentMemberLedgerEntryDto,
  PaymentStatus,
} from '@club-social/shared/payments';

export class PaymentDueSettlementDueResponseDto implements PaymentDueSettlementDueDto {
  public amount: number;
  public category: DueCategory;
  public id: string;
}

export class PaymentMemberLedgerEntryResponseDto implements PaymentMemberLedgerEntryDto {
  public date: string;
  public id: string;
}

export class PaymentMemberResponseDto implements PaymentMemberDto {
  public id: string;
  public name: string;
}

export class PaymentResponseDto implements PaymentDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public member: PaymentMemberResponseDto;
  public memberId: string;
  public memberName: string;
  public notes: null | string;
  public receiptNumber: null | string;
  public settlements: PaymentSettlementResponseDto[];
  public status: PaymentStatus;
  public updatedAt: string;
  public updatedBy?: null | string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}

export class PaymentSettlementResponseDto implements PaymentDueSettlementDto {
  public amount: number;
  public due: PaymentDueSettlementDueResponseDto;
  public memberLedgerEntry: PaymentMemberLedgerEntryResponseDto;
  public status: DueSettlementStatus;
}
