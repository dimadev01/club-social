import { injectable } from 'tsyringe';

import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { EventController } from '@ui/controllers/event.controller';

@injectable()
export class EventMethods extends MeteorMethods {
  public constructor(private readonly _controller: EventController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.EventsGetGrid]: (req: GetGridRequestDto) =>
        this.execute(this._controller.getGrid.bind(this._controller), req),
    });
  }
}
