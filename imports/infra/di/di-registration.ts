import { container, instanceCachingFactory } from 'tsyringe';
import { DIToken } from '@infra/di/di-tokens';
import { EmailService } from '@infra/email/email.service';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { CategoryRepository } from '@infra/mongo/repositories/category.repository';
import { MemberRepository } from '@infra/mongo/repositories/member.repository';
import { MovementRepository } from '@infra/mongo/repositories/movement.repository';

container.register(DIToken.Logger, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(DIToken.CategoryRepository, CategoryRepository);

container.register(DIToken.EmailService, EmailService);

container.register(DIToken.MovementRepository, MovementRepository);

container.register(DIToken.MemberRepository, MemberRepository);
