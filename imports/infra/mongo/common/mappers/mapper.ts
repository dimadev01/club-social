import { validate } from 'class-validator';

import { Model } from '@domain/common/models/model';
import { Entity } from '@infra/mongo/common/entities/entity';
import { ClassValidationError } from '@ui/common/errors/class-validation.error';

export abstract class Mapper<TDomain extends Model, TEntity extends Entity> {
  public async toEntity(domain: TDomain): Promise<TEntity> {
    const entity = this.getEntity(domain);

    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new ClassValidationError(errors);
    }

    return entity;
  }

  public abstract toDomain(entity: TEntity): TDomain;

  protected abstract getEntity(domain: TDomain): TEntity;
}
