import { container, instanceCachingFactory } from 'tsyringe';
import { Tokens } from '@infra/di/di-tokens';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { CategoryRepository } from '@infra/mongo/repositories/category.repository';

container.register(Tokens.Logger, {
  useFactory: instanceCachingFactory((c) => c.resolve(LoggerOstrio)),
});

container.register(Tokens.CategoryRepository, CategoryRepository);
