import { container, instanceCachingFactory } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { MovementFindPaginatedRepository } from '@infra/mongo/old/movements/movement-find-paginated.repository';
import { MovementRepository } from '@infra/mongo/old/movements/movement.repository';
import { MongoUnitOfWork } from '@infra/mongo/repositories/common/mongo.unit-of-work';
import { DueMongoRepository } from '@infra/mongo/repositories/due-mongo.repository';
import { MemberCreditMongoRepository } from '@infra/mongo/repositories/member-credit-mongo.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';
import { PaymentDueMongoRepository } from '@infra/mongo/repositories/payment-due-mongo.repository';
import { PaymentMongoRepository } from '@infra/mongo/repositories/payment-mongo.repository';
import { UserMongoRepository } from '@infra/mongo/repositories/user-mongo.repository';

container.register(DIToken.Logger, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(DIToken.MovementRepository, MovementRepository);

container.register(
  DIToken.MovementFindPaginatedRepository,
  MovementFindPaginatedRepository,
);

container.register(DIToken.IMeteorUsers, { useValue: Meteor.users });

container.register(DIToken.IUnitOfWork, MongoUnitOfWork);

container.register(DIToken.IDueRepository, DueMongoRepository);

container.register(DIToken.IMemberRepository, MemberMongoRepository);

container.register(
  DIToken.IMemberCreditRepository,
  MemberCreditMongoRepository,
);

container.register(DIToken.IPaymentRepository, PaymentMongoRepository);

container.register(DIToken.IPaymentDueRepository, PaymentDueMongoRepository);

container.register(DIToken.IUserRepository, UserMongoRepository);
