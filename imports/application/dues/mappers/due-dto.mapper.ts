import { injectable } from 'tsyringe';

import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { Due } from '@domain/dues/models/due.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class DueDtoMapper extends MapperDto<Due, DueDto> {
  public constructor(private readonly _memberDtoMapper: MemberDtoMapper) {
    super();
  }

  public toDto(due: Due): DueDto {
    return {
      amount: due.amount.value,
      category: due.category,
      createdAt: due.createdAt.toISOString(),
      date: due.date.toISOString(),
      id: due._id,
      member: due.member ? this._memberDtoMapper.toDto(due.member) : undefined,
      memberId: due.memberId,
      notes: due.notes,
      payments: due.payments.map<DuePaymentDto>((payment) => ({
        creditAmount: payment.creditAmount.value,
        directAmount: payment.directAmount.value,
        paymentDate: payment.paymentDate.toISOString(),
        paymentId: payment.paymentId,
        paymentReceiptNumber: payment.paymentReceiptNumber,
        paymentStatus: payment.paymentStatus,
        totalAmount: payment.totalAmount.value,
      })),
      status: due.status,
      totalPaidAmount: due.totalPaidAmount.value,
      totalPendingAmount: due.totalPendingAmount.value,
      voidReason: due.voidReason,
      voidedAt: due.voidedAt?.toISOString() ?? null,
      voidedBy: due.voidedBy,
    };
  }
}
