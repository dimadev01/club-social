import { injectable } from 'tsyringe';
import { GetServicesUseCase } from '@domain/services/use-cases/get-services/get-services.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class ServiceMethod extends MeteorMethod {
  public constructor(private readonly _getServices: GetServicesUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.ServicesGetAll]: () => this.execute(this._getServices),
    });
  }
}
