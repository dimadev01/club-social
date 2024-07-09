import { container } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { EmailSendGridService } from '@infra/email/email-sendgrid.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { MongoUnitOfWork } from '@infra/mongo/repositories/common/mongo.unit-of-work';
import { DueMongoRepository } from '@infra/mongo/repositories/due-mongo.repository';
import { EmailMongoRepository } from '@infra/mongo/repositories/email-mongo.repository';
import { EventMongoRepository } from '@infra/mongo/repositories/event-mongo.repository';
import { MemberCreditMongoRepository } from '@infra/mongo/repositories/member-credit-mongo.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';
import { MovementMongoRepository } from '@infra/mongo/repositories/movement-mongo.repository';
import { NotificationMongoRepository } from '@infra/mongo/repositories/notification-mongo.repository';
import { PaymentMongoRepository } from '@infra/mongo/repositories/payment-mongo.repository';
import { PriceCategoryMongoRepository } from '@infra/mongo/repositories/price-category-mongo.repository';
import { PriceMongoRepository } from '@infra/mongo/repositories/price-mongo.repository';
import { UserMongoRepository } from '@infra/mongo/repositories/user-mongo.repository';

container.registerSingleton(DIToken.ILoggerService, LoggerOstrio);

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

container.register(DIToken.IEventRepository, EventMongoRepository);

container.register(DIToken.IPriceRepository, PriceMongoRepository);

container.register(
  DIToken.IPriceCategoryRepository,
  PriceCategoryMongoRepository,
);

container.register(
  DIToken.INotificationRepository,
  NotificationMongoRepository,
);
