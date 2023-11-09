import { injectable } from 'tsyringe';
import { GetProfessorsUseCase } from '@domain/professors/use-cases/get-professors/get-professors.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class ProfessorMethod extends MeteorMethod {
  public constructor(private readonly _getProfessors: GetProfessorsUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.ProfessorsGetAll]: () => this.execute(this._getProfessors),
    });
  }
}
