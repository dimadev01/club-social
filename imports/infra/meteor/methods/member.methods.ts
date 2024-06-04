import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MemberController } from '@adapters/controllers/member.controller';
import { CreateMemberRequestDto } from '@adapters/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { UpdateMemberRequestDto } from '@adapters/dtos/update-member-request.dto';
import { GetMembersRequest } from '@application/members/use-cases/get-members/get-members.request';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';

@injectable()
export class MemberMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MembersGet]: (req: GetMembersRequest) =>
        this._controller.get(req),
      [MeteorMethodEnum.MembersGetGrid]: (req: GetMembersGridRequestDto) =>
        this._controller.getGrid(req),
      [MeteorMethodEnum.MembersCreate]: (req: CreateMemberRequestDto) =>
        this._controller.createOne(req),
      [MeteorMethodEnum.MembersGetOne]: (req: GetOneDtoByIdRequestDto) =>
        this._controller.getOne(req),
      [MeteorMethodEnum.MembersGetToExport]: (req: GetMembersGridRequestDto) =>
        this._controller.getToExport(req),
      [MeteorMethodEnum.MembersUpdate]: (req: UpdateMemberRequestDto) =>
        this._controller.update(req),
    });
  }

  public constructor(private readonly _controller: MemberController) {
    super();
  }
}
