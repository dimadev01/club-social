import { AuditableEntity } from '@infra/mongo/entities/common/auditable.entity';
import { PaymentEntity } from '@infra/mongo/entities/payments/payment.entity';

export class PaymentAuditEntity extends AuditableEntity<PaymentEntity> {}
