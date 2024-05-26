import { container, instanceCachingFactory } from 'tsyringe';
import { DIToken } from '@infra/di/di-tokens';
import { EmailService } from '@infra/email/email.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { CategoryRepository } from '@infra/mongo/repositories/categories/category.repository';
import { DueRepository } from '@infra/mongo/repositories/dues/due.repository';
import { MemberRepository } from '@infra/mongo/repositories/members/member.repository';
import { MovementFindPaginatedRepository } from '@infra/mongo/repositories/movements/movement-find-paginated.repository';
import { MovementRepository } from '@infra/mongo/repositories/movements/movement.repository';
import { PaymentRepository } from '@infra/mongo/repositories/payments/payment.repository';
import { PaymentDueRepository } from '@infra/mongo/repositories/payment-due/payment-due.repository';

container.register(DIToken.Logger, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(DIToken.CategoryRepository, CategoryRepository);

container.register(DIToken.EmailService, EmailService);

container.register(DIToken.MovementRepository, MovementRepository);

container.register(
  DIToken.MovementFindPaginatedRepository,
  MovementFindPaginatedRepository,
);

container.register(DIToken.MemberRepository, MemberRepository);

container.register(DIToken.DueRepository, DueRepository);

container.register(DIToken.PaymentRepository, PaymentRepository);

container.register(DIToken.PaymentDueRepository, PaymentDueRepository);
