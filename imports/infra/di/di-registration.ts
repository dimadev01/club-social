import { container, instanceCachingFactory } from 'tsyringe';
import { Tokens } from '@infra/di/di-tokens';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { CategoryRepository } from '@infra/mongo/repositories/category.repository';
import { MovementRepository } from '@infra/mongo/repositories/movement.repository';

container.register(Tokens.Logger, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(Tokens.CategoryRepository, CategoryRepository);

container.register(Tokens.MovementRepository, MovementRepository);
