import { injectable } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { DueDto } from '@application/dues/dtos/due.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { Due } from '@domain/dues/models/due.model';

@injectable()
export class DueDtoMapper extends MapperDto<Due, DueDto> {
  public constructor(private readonly _memberDtoMapper: MemberDtoMapper) {
    super();
  }

  public toDto(due: Due): DueDto {
    return {
      amount: due.amount.value,
      category: due.category,
      date: due.date.toISOString(),
      id: due._id,
      member: due.member ? this._memberDtoMapper.toDto(due.member) : undefined,
      memberId: due.memberId,
      notes: due.notes,
      payments: due.payments.map((payment) => ({
        amount: payment.amount.value,
        date: payment.date.toISOString(),
        paymentId: payment.paymentId,
        receiptNumber: payment.receiptNumber,
        status: payment.status,
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
