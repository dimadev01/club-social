import { validate } from 'class-validator';

import { Entity } from '@adapters/common/entities/entity';
import { ClassValidationError } from '@adapters/common/errors/class-validation.error';
import { Model } from '@domain/common/models/model';

export abstract class Mapper<TModel extends Model, TEntity extends Entity> {
  public async toEntity(model: TModel): Promise<TEntity> {
    const entity = this.getEntity(model);

    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new ClassValidationError(errors);
    }

    return entity;
  }

  public abstract toModel(orm: TEntity): TModel;

  protected abstract getEntity(model: TModel): TEntity;
}
