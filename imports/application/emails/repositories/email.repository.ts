import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { IGridRepository } from '@application/common/repositories/grid.repository';
import { Email } from '@domain/emails/models/email.model';

export interface IEmailRepository
  extends ICrudRepository<Email>,
    IGridRepository<Email> {}
