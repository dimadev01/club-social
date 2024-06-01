import { container, instanceCachingFactory } from 'tsyringe';

import { MemberMongoRepository } from '@adapters/members/member-mongo.repository';
import { DueRepository } from '@adapters/repositories/dues/due.repository';
import { MongoUnitOfWork } from '@adapters/repositories/mongo.unit-of-work';
import { MovementFindPaginatedRepository } from '@adapters/repositories/movements/movement-find-paginated.repository';
import { MovementRepository } from '@adapters/repositories/movements/movement.repository';
import { PaymentDueRepository } from '@adapters/repositories/payment-due/payment-due.repository';
import { PaymentDueMongoRepository } from '@adapters/repositories/payment-due-mongo.repository';
import { PaymentMongoRepository } from '@adapters/repositories/payment-mongo.repository';
import { UserMongoRepository } from '@adapters/repositories/user-mongo.repository';
import { DIToken } from '@domain/common/tokens.di';
import { EmailService } from '@infra/email/email.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { MemberAuditableCollection } from '@infra/mongo/collections/member-auditable.collection';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';

container.register(DIToken.Logger, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(DIToken.EmailService, EmailService);

container.register(DIToken.MovementRepository, MovementRepository);

container.register(
  DIToken.MovementFindPaginatedRepository,
  MovementFindPaginatedRepository,
);

container.register(DIToken.DueRepository, DueRepository);

container.register(DIToken.PaymentDueRepository, PaymentDueRepository);

container.register(DIToken.MemberMongoCollection, {
  useFactory: instanceCachingFactory((c) => c.resolve(MemberMongoCollection)),
});

container.register(DIToken.MemberAuditableMongoCollection, {
  useFactory: instanceCachingFactory((c) =>
    c.resolve(MemberAuditableCollection),
  ),
});

container.register(DIToken.IMemberRepository, MemberMongoRepository);

container.register(DIToken.IPaymentRepository, PaymentMongoRepository);

container.register(DIToken.IPaymentDueRepository, PaymentDueMongoRepository);

container.register(DIToken.IUserRepository, UserMongoRepository);

container.register(DIToken.IMeteorUsers, { useValue: Meteor.users });

container.register(DIToken.IUnitOfWork, MongoUnitOfWork);
