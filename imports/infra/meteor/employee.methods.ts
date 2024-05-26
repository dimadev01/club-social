import { injectable } from 'tsyringe';

import { GetEmployeesUseCase } from '@domain/employees/use-cases/get-employees/get-employees.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class EmployeeMethod extends MeteorMethod {
  public constructor(private readonly _getEmployees: GetEmployeesUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.EmployeesGetAll]: () => this.execute(this._getEmployees),
    });
  }
}
