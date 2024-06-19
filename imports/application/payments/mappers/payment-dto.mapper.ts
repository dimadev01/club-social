import { injectable } from 'tsyringe';

import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { Payment } from '@domain/payments/models/payment.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class PaymentDtoMapper extends MapperDto<Payment, PaymentDto> {
  public constructor(private readonly _memberDtoMapper: MemberDtoMapper) {
    super();
  }

  public toDto(payment: Payment): PaymentDto {
    return {
      amount: payment.amount.amount,
      createdAt: payment.createdAt.toISOString(),
      createdBy: payment.createdBy,
      date: payment.date.toISOString(),
      dues: payment.dues.map<PaymentDueDto>((due) => ({
        creditAmount: due.creditAmount.amount,
        directAmount: due.directAmount.amount,
        dueAmount: due.dueAmount.amount,
        dueCategory: due.dueCategory,
        dueDate: due.dueDate.toISOString(),
        dueId: due.dueId,
        duePendingAmount: due.duePendingAmount.amount,
        id: due.dueId,
        totalAmount: due.totalAmount.amount,
      })),
      id: payment._id,
      isVoided: payment.isVoided(),
      member: payment.member
        ? this._memberDtoMapper.toDto(payment.member)
        : undefined,
      memberId: payment.memberId,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
      voidReason: payment.voidReason,
      voidedAt: payment.voidedAt?.toISOString() ?? null,
      voidedBy: payment.voidedBy,
    };
  }
}
