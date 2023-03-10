import { injectable } from 'tsyringe';
import { GetEmployeesUseCase } from '@domain/employees/use-cases/get-employees/get-employees.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class EmployeesMethods extends BaseMethod {
  public constructor(private readonly _getEmployees: GetEmployeesUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.EmployeesGetAll]: () => this.execute(this._getEmployees),
    });
  }
}
