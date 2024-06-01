import { container, instanceCachingFactory } from 'tsyringe';

import { MemberMongoRepository } from '@adapters/members/repositories/member-mongo.repository';
import { CategoryRepository } from '@adapters/repositories/categories/category.repository';
import { DueRepository } from '@adapters/repositories/dues/due.repository';
import { MongoUnitOfWork } from '@adapters/repositories/mongo.unit-of-work';
import { MovementFindPaginatedRepository } from '@adapters/repositories/movements/movement-find-paginated.repository';
import { MovementRepository } from '@adapters/repositories/movements/movement.repository';
import { PaymentDueRepository } from '@adapters/repositories/payment-due/payment-due.repository';
import { PaymentDueMongoRepository } from '@adapters/repositories/payment-due-mongo.repository';
import { PaymentMongoRepository } from '@adapters/repositories/payment-mongo.repository';
import { PaymentRepository } from '@adapters/repositories/payments/payment.repository';
import { UserMongoRepository } from '@adapters/repositories/user-mongo.repository';
import { DIToken } from '@domain/common/tokens.di';
import { EmailService } from '@infra/email/email.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';

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

container.register(DIToken.DueRepository, DueRepository);

container.register(DIToken.PaymentRepository, PaymentRepository);

container.register(DIToken.PaymentDueRepository, PaymentDueRepository);

container.register(DIToken.MemberMongoCollection, {
  useFactory: instanceCachingFactory((c) => c.resolve(MemberMongoCollection)),
});

container.register(DIToken.IMemberRepository, MemberMongoRepository);

container.register(DIToken.IPaymentRepository, PaymentMongoRepository);

container.register(DIToken.IPaymentDueRepository, PaymentDueMongoRepository);

container.register(DIToken.IUserRepository, UserMongoRepository);

container.register(DIToken.IMeteorUsers, { useValue: Meteor.users });

container.register(DIToken.IUnitOfWork, MongoUnitOfWork);
