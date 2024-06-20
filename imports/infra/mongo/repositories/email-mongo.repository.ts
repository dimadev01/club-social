import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { IEmailRepository } from '@application/emails/repositories/email.repository';
import { Email } from '@domain/emails/models/email.model';
import { EmailMongoCollection } from '@infra/mongo/collections/email.collection';
import { EmailEntity } from '@infra/mongo/entities/email.entity';
import { EmailMapper } from '@infra/mongo/mappers/email.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class EmailMongoRepository
  extends CrudMongoRepository<Email, EmailEntity>
  implements IEmailRepository
{
  constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: EmailMongoCollection,
    protected readonly mapper: EmailMapper,
  ) {
    super(collection, mapper, logger);
  }

  findPaginated(): Promise<FindPaginatedResponse<Email>> {
    throw new Error('Method not implemented.');
  }
}
