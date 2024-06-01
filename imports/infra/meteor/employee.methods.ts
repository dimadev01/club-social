import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetEmployeesUseCase } from '@domain/employees/use-cases/get-employees/get-employees.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class EmployeeMethod extends MeteorMethod {
  public constructor(private readonly _getEmployees: GetEmployeesUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.EmployeesGetAll]: () =>
        this.execute(this._getEmployees),
    });
  }
}
