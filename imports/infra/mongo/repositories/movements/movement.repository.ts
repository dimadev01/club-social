import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { CategoryEnum } from '@domain/categories/category.enum';
import { Movement } from '@domain/movements/entities/movement.entity';
import {
  MovementCollection,
  MovementSchema,
} from '@domain/movements/movement.collection';
import { IMovementPort } from '@domain/movements/movement.port';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';

@injectable()
export class MovementRepository
  extends MongoCrudRepository<Movement>
  implements IMovementPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  public async findNextToMigrate(id: string): Promise<Movement | null> {
    const movement = await this.findOneByIdOrThrow(id);

    const query: Mongo.Query<Movement> = {
      _id: { $ne: id },
      category: {
        $in: [
          CategoryEnum.GuestIncome,
          CategoryEnum.MembershipIncome,
          CategoryEnum.ElectricityIncome,
        ],
      },
      date: { $gt: movement.date },
      isDeleted: false,
      memberId: movement.memberId,
    };

    return (
      (await this.getCollection().findOneAsync(query, {
        sort: { date: 1 },
      })) ?? null
    );
  }

  protected getCollection(): MongoCollection<Movement> {
    return MovementCollection;
  }

  protected getSchema(): SimpleSchema {
    return MovementSchema;
  }
}
