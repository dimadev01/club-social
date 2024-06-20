import { container, instanceCachingFactory } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { EmailSendGridService } from '@infra/email/email-sendgrid.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { MongoUnitOfWork } from '@infra/mongo/repositories/common/mongo.unit-of-work';
import { DueMongoRepository } from '@infra/mongo/repositories/due-mongo.repository';
import { EmailMongoRepository } from '@infra/mongo/repositories/email-mongo.repository';
import { MemberCreditMongoRepository } from '@infra/mongo/repositories/member-credit-mongo.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';
import { MovementMongoRepository } from '@infra/mongo/repositories/movement-mongo.repository';
import { PaymentMongoRepository } from '@infra/mongo/repositories/payment-mongo.repository';
import { UserMongoRepository } from '@infra/mongo/repositories/user-mongo.repository';

container.register(DIToken.ILoggerService, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(DIToken.IMeteorUsers, { useValue: Meteor.users });

container.register(DIToken.IUnitOfWork, MongoUnitOfWork);

container.register(DIToken.IDueRepository, DueMongoRepository);

container.register(DIToken.IMemberRepository, MemberMongoRepository);

container.register(
  DIToken.IMemberCreditRepository,
  MemberCreditMongoRepository,
);

container.register(DIToken.IPaymentRepository, PaymentMongoRepository);

container.register(DIToken.IMovementRepository, MovementMongoRepository);

container.register(DIToken.IUserRepository, UserMongoRepository);

container.register(DIToken.IEmailService, EmailSendGridService);

container.register(DIToken.IEmailRepository, EmailMongoRepository);
