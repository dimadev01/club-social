import { validate } from 'class-validator';

import { Model } from '@domain/common/models/model';
import { EntityNewV } from '@infra/mongo/entities/common/entity';
import { ClassValidationError } from '@infra/mongo/errors/class-validation.error';

export abstract class Mapper<TModel extends Model, TEntity extends EntityNewV> {
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
