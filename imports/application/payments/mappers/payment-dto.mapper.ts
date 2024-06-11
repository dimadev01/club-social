import { injectable } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { Payment } from '@domain/payments/models/payment.model';

@injectable()
export class PaymentDtoMapper extends MapperDto<Payment, PaymentDto> {
  public constructor(private readonly _memberDtoMapper: MemberDtoMapper) {
    super();
  }

  public toDto(payment: Payment): PaymentDto {
    return {
      amount: payment.amount.value,
      date: payment.date.toISOString(),
      dues: payment.dues.map<PaymentDueDto>((due) => ({
        amount: due.amount.value,
        dueAmount: due.dueAmount.value,
        dueCategory: due.dueCategory,
        dueDate: due.dueDate.toISOString(),
        dueId: due.dueId,
        id: due.dueId,
      })),
      id: payment._id,
      member: payment.member
        ? this._memberDtoMapper.toDto(payment.member)
        : undefined,
      memberId: payment.memberId,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
    };
  }
}
