import { CreateMemberNewUseCase } from '@domain/members/use-cases/create-member-new/create-member-use-case';
import type { ClientSession } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { CreateMemberResponse } from '@domain/members/use-cases/create-member-new/create-member.response';
import { GetMemberResponse } from '@domain/members/use-cases/get-member-new/get-member.response';
import { GetMemberNewUseCase } from '@domain/members/use-cases/get-member-new/get-member.use.case';
import { BaseController } from '@infra/controllers/base.controller';
import { CreateMemberRequestDto } from '@infra/controllers/types/create-member-request.dto';
import { GetMemberRequestDto } from '@infra/controllers/types/get-member-request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    @inject(CreateMemberNewUseCase)
    private readonly _createMemberUseCase: CreateMemberNewUseCase<ClientSession>,
    @inject(GetMemberNewUseCase)
    private readonly _getMemberUseCase: GetMemberNewUseCase,
  ) {
    super(logger);
  }

  private getMember(
    request: GetMemberRequestDto,
  ): Promise<GetMemberResponse | null> {
    return this.execute({
      classType: GetMemberRequestDto,
      request,
      useCase: this._getMemberUseCase,
    });
  }

  private createMember(
    request: CreateMemberRequestDto,
  ): Promise<CreateMemberResponse> {
    return this.execute({
      classType: CreateMemberRequestDto,
      request,
      useCase: this._createMemberUseCase,
    });
  }

  public register(): void {
    Meteor.methods({
      [MethodsEnum.MembersCreateNew]: this.createMember.bind(this),
      [MethodsEnum.MembersGetNew]: this.getMember.bind(this),
    });
  }
}
