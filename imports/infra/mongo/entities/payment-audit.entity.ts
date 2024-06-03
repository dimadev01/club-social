import { AuditableEntity } from '@infra/mongo/common/entities/auditable.entity';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';

export class PaymentAuditEntity extends AuditableEntity<PaymentEntity> {}
