import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetServicesUseCase } from '@domain/services/use-cases/get-services/get-services.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class ServiceMethod extends MeteorMethod {
  public constructor(private readonly _getServices: GetServicesUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.ServicesGetAll]: () => this.execute(this._getServices),
    });
  }
}
