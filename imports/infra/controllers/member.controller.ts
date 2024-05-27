import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { CreateMemberNewUseCase } from '@domain/members/use-cases/create-member-new/create-member-use-case';
import { GetMemberRequest } from '@domain/members/use-cases/get-member-new/get-member.request';
import { GetMemberResponse } from '@domain/members/use-cases/get-member-new/get-member.response';
import { GetMemberNewUseCase } from '@domain/members/use-cases/get-member-new/get-member.use.case';
import { BaseController } from '@infra/controllers/base.controller';
import { DIToken } from '@infra/di/di-tokens';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    @inject(CreateMemberNewUseCase)
    private readonly _createMember: CreateMemberNewUseCase,
    @inject(GetMemberNewUseCase)
    private readonly _getMember: GetMemberNewUseCase,
  ) {
    super(logger);
  }

  public getMember(
    request: GetMemberRequest,
  ): Promise<GetMemberResponse | null> {
    return this.execute({ request, useCase: this._getMember });
  }

  public register(): void {
    Meteor.methods({
      [MethodsEnum.MembersCreateNew]: () =>
        this.execute({ useCase: this._createMember }),
      [MethodsEnum.MembersGetNew]: this.getMember.bind(this),
    });
  }
}
