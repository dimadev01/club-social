import { container } from 'tsyringe';

import { GetEventsGridUseCase } from '@application/events/use-cases/get-events-grid/get-events-grid.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetEventsGridRequestDto } from '@ui/dtos/get-events-grid-request.dto';

export class EventMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.EventsGetGrid]: (req: GetEventsGridRequestDto) =>
        this.execute(
          container.resolve(GetEventsGridUseCase),
          GetEventsGridRequestDto,
          req,
        ),
    });
  }
}
