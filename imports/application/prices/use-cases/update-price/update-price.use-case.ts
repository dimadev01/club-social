import { Result, err } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { IEventRepository } from '@application/events/repositories/event.repository';
import { PriceDto } from '@application/prices/dtos/price.dto';
import { IPriceCategoryRepository } from '@application/prices/repositories/price-category.repository';
import { IPriceRepository } from '@application/prices/repositories/price.repository';
import { GetPriceUseCase } from '@application/prices/use-cases/get-price/get-price.use-case';
import { UpdatePriceRequest } from '@application/prices/use-cases/update-price/update-price.request';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { Money } from '@domain/common/value-objects/money.value-object';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { Event } from '@domain/events/models/event.model';

@injectable()
export class UpdatePriceUseCase
  implements IUseCase<UpdatePriceRequest, PriceDto>
{
  public constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IPriceRepository)
    private readonly _priceRepository: IPriceRepository,
    @inject(DIToken.IPriceCategoryRepository)
    private readonly _priceCategoryRepository: IPriceCategoryRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IEventRepository)
    private readonly _eventRepository: IEventRepository,
    private readonly _getPriceByIdUseCase: GetPriceUseCase,
  ) {}

  public async execute(
    request: UpdatePriceRequest,
  ): Promise<Result<PriceDto, Error>> {
    try {
      this._unitOfWork.start();

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const price = await this._priceRepository.findOneByIdOrThrow({
          id: request.id,
        });

        await Promise.all(
          request.categories.map(async (categoryUpdate) => {
            const category =
              await this._priceCategoryRepository.findOneByIdOrThrow({
                id: categoryUpdate.id,
              });

            const amount = Money.create({ amount: categoryUpdate.amount });

            if (amount.isErr()) {
              throw amount.error;
            }

            category.amount = amount.value;

            await this._priceCategoryRepository.updateWithSession(
              category,
              unitOfWork,
            );
          }),
        );

        const event = Event.create({
          action: EventActionEnum.UPDATE,
          description: null,
          resource: EventResourceEnum.PRICES,
          resourceId: price._id,
        });

        if (event.isErr()) {
          throw event.error;
        }

        await this._eventRepository.insertWithSession(event.value, unitOfWork);
      });

      return await this._getPriceByIdUseCase.execute({
        id: request.id,
      });
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await this._unitOfWork.end();
    }
  }
}
