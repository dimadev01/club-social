import { injectable } from 'tsyringe';
import { GetProfessorsUseCase } from '@domain/professors/use-cases/get-professors/get-professors.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class ProfessorsMethods extends BaseMethod {
  public constructor(private readonly _getProfessors: GetProfessorsUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.ProfessorsGetAll]: () => this.execute(this._getProfessors),
    });
  }
}
