import { singleton } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { PaymentDueDto } from '@application/payments/dtos/payment.dto';
import { PaymentDue } from '@domain/payments/models/payment-due.model';

@singleton()
export class PaymentDueDtoMapper extends MapperDto<PaymentDue, PaymentDueDto> {
  public toDto(domain: PaymentDue): PaymentDueDto {
    return {
      amount: domain.amount.amount,
      dueId: domain.dueId,
    };
  }
}
