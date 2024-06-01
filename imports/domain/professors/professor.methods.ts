import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetProfessorsUseCase } from '@domain/professors/use-cases/get-professors/get-professors.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class ProfessorMethod extends MeteorMethod {
  public constructor(private readonly _getProfessors: GetProfessorsUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.ProfessorsGetAll]: () =>
        this.execute(this._getProfessors),
    });
  }
}
