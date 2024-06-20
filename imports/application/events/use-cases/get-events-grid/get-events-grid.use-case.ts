import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { EventGridDto } from '@application/events/dtos/event-grid.dto';
import {
  FindPaginatedEventsRequest,
  IEventRepository,
} from '@application/events/repositories/event.repository';

@injectable()
export class GetEventsGridUseCase
  implements
    IUseCase<FindPaginatedEventsRequest, FindPaginatedResponse<EventGridDto>>
{
  public constructor(
    @inject(DIToken.IEventRepository)
    private readonly _eventRepository: IEventRepository,
  ) {}

  public async execute(
    request: FindPaginatedEventsRequest,
  ): Promise<Result<FindPaginatedResponse<EventGridDto>, Error>> {
    const { items, totalCount } =
      await this._eventRepository.findPaginated(request);

    return ok({
      items: items.map<EventGridDto>((event) => ({
        action: event.action,
        createdAt: event.createdAt.toISOString(),
        createdBy: event.createdBy,
        description: event.description,
        id: event._id,
        resource: event.resource,
        resourceId: event.resourceId,
      })),
      totalCount,
    });
  }
}
