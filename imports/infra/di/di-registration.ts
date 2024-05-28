import { container, instanceCachingFactory } from 'tsyringe';

import { DIToken } from '@infra/di/di-tokens';
import { EmailService } from '@infra/email/email.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { CategoryRepository } from '@infra/mongo/repositories/categories/category.repository';
import { MongoUnitOfWork } from '@infra/mongo/repositories/common/mongo.unit-of-work';
import { DueRepository } from '@infra/mongo/repositories/dues/due.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/members/member-mongo.repository';
import { MemberRepositoryOld } from '@infra/mongo/repositories/members/member.repository.old';
import { MovementFindPaginatedRepository } from '@infra/mongo/repositories/movements/movement-find-paginated.repository';
import { MovementRepository } from '@infra/mongo/repositories/movements/movement.repository';
import { PaymentDueRepository } from '@infra/mongo/repositories/payment-due/payment-due.repository';
import { PaymentRepository } from '@infra/mongo/repositories/payments/payment.repository';
import { UserMongoRepository } from '@infra/mongo/repositories/users/user-mongo.repository';

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

container.register(DIToken.MemberRepositoryOld, MemberRepositoryOld);

container.register(DIToken.DueRepository, DueRepository);

container.register(DIToken.PaymentRepository, PaymentRepository);

container.register(DIToken.PaymentDueRepository, PaymentDueRepository);

container.register(DIToken.PaymentDueRepository, PaymentDueRepository);

container.register(DIToken.IMemberRepository, MemberMongoRepository);

container.register(DIToken.IUserRepository, UserMongoRepository);

container.register(DIToken.IMeteorUsers, {
  useValue: Meteor.users,
});

container.register(DIToken.IUnitOfWork, MongoUnitOfWork);
