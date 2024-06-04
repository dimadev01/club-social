import { singleton } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { MemberDtoMapper } from '@adapters/mappers/member-dto.mapper';
import { PaymentDueDtoMapper } from '@adapters/mappers/payment-due-dto.mapper';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { Payment } from '@domain/payments/models/payment.model';

@singleton()
export class PaymentDtoMapper extends MapperDto<Payment, PaymentDto> {
  public constructor(
    private readonly _memberDtoMapper: MemberDtoMapper,
    private readonly _paymentDueDtoMapper: PaymentDueDtoMapper,
  ) {
    super();
  }

  public toDto(domain: Payment): PaymentDto {
    return {
      date: domain.date.toISOString(),
      dues:
        domain.paymentDues?.map((paymentDue) =>
          this._paymentDueDtoMapper.toDto(paymentDue),
        ) ?? [],
      id: domain._id,
      member: domain.member
        ? this._memberDtoMapper.toDto(domain.member)
        : undefined,
      memberId: domain.memberId,
      notes: domain.notes,
      receiptNumber: domain.receiptNumber,
    };
  }
}
