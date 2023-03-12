import { injectable } from 'tsyringe';
import { GetServicesUseCase } from '@domain/services/use-cases/get-services/get-services.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class ServicesMethods extends BaseMethod {
  public constructor(private readonly _getServices: GetServicesUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.ServicesGetAll]: () => this.execute(this._getServices),
    });
  }
}
