import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { MovementDtoMapper } from '@application/movements/mappers/movement-dto.mapper';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMovementRepository } from '@domain/movements/movement.repository';

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
