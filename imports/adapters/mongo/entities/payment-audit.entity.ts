import { AuditableEntity } from '@adapters/common/entities/auditable.entity';
import { PaymentEntity } from '@adapters/mongo/entities/payment.entity';

export class PaymentAuditEntity extends AuditableEntity<PaymentEntity> {}
