import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { GetMovementsRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-request.dto';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/movement-grid.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMovementsUseCase
  extends UseCase<GetMovementsRequestDto>
  implements
    IUseCase<GetMovementsRequestDto, PaginatedResponse<MovementGridDto>>
{
  public async execute(
    request: GetMovementsRequestDto
  ): Promise<Result<PaginatedResponse<MovementGridDto>, Error>> {
    await this.validateDto(GetMovementsRequestDto, request);

    const query: Mongo.Query<Movement> = {
      isDeleted: false,
    };

    const pipeline = [];

    pipeline.push({ $match: query });

    if (request.search) {
      pipeline.push({
        $match: {
          $expr: {
            $or: [
              {
                $regexMatch: {
                  input: '$member.firstName',
                  options: 'i',
                  regex: request.search,
                },
              },
              {
                $regexMatch: {
                  input: '$member.lastName',
                  options: 'i',
                  regex: request.search,
                },
              },
            ],
          },
        },
      });
    }

    const totalResult = await MovementsCollection.rawCollection()
      .aggregate([...pipeline, { $count: 'total' }])
      .toArray();

    const data: Movement[] = await MovementsCollection.rawCollection()
      .aggregate<Movement>([
        ...pipeline,
        { $skip: (request.page - 1) * request.pageSize },
        { $limit: request.pageSize },
      ])
      .map((movement: Movement) => plainToInstance(Movement, movement))
      .toArray();

    return ok<PaginatedResponse<MovementGridDto>>({
      data: data.map((movement) => ({
        _id: movement._id,
        amount: new Intl.NumberFormat('es-AR').format(movement.amount),
        category: movement.category,
        date: movement.dateFormatted,
      })),
      total: totalResult.length > 0 ? totalResult[0].total : 0,
    });
  }
}
