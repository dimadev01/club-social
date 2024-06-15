import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { MovementDtoMapper } from '@application/movements/mappers/movement-dto.mapper';
import { IMovementRepository } from '@application/movements/repositories/movement.repository';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

@injectable()
export class GetMovementUseCase implements IUseCase<FindOneById, MovementDto> {
  public constructor(
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
    private readonly _movementDtoMapper: MovementDtoMapper,
  ) {}

  public async execute(
    request: FindOneById,
  ): Promise<Result<MovementDto, Error>> {
    const movement = await this._movementRepository.findOneById(request);

    if (!movement) {
      return err(new ModelNotFoundError());
    }

    return ok(this._movementDtoMapper.toDto(movement));
  }
}
