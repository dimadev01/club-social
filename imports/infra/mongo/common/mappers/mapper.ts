import { validate } from 'class-validator';

import { ClassValidationError } from '@adapters/common/errors/class-validation.error';
import { Model } from '@domain/common/models/model';
import { Entity } from '@infra/mongo/common/entities/entity';

export abstract class Mapper<TDomain extends Model, TEntity extends Entity> {
  public async toEntity(model: TDomain): Promise<TEntity> {
    const entity = this.getEntity(model);

    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new ClassValidationError(errors);
    }

    return entity;
  }

  public abstract toDomain(orm: TEntity): TDomain;

  protected abstract getEntity(domain: TDomain): TEntity;
}
