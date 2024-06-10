import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MemberController } from '@adapters/controllers/member.controller';
import { CreateMemberRequestDto } from '@adapters/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@adapters/dtos/get-members-request.dto';
import { UpdateMemberRequestDto } from '@adapters/dtos/update-member-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';

@injectable()
export class MemberMethods extends MeteorMethods {
  public constructor(private readonly _controller: MemberController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MembersGet]: (req: GetMembersRequestDto) =>
        this.execute(this._controller.get.bind(this._controller), req),
      [MeteorMethodEnum.MembersGetGrid]: (req: GetMembersGridRequestDto) =>
        this.execute(this._controller.getGrid.bind(this._controller), req),
      [MeteorMethodEnum.MembersCreate]: (req: CreateMemberRequestDto) =>
        this.execute(this._controller.createOne.bind(this._controller), req),
      [MeteorMethodEnum.MembersGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(this._controller.getOne.bind(this._controller), req),
      [MeteorMethodEnum.MembersGetToExport]: (req: GetMembersGridRequestDto) =>
        this.execute(this._controller.getToExport.bind(this._controller), req),
      [MeteorMethodEnum.MembersUpdate]: (req: UpdateMemberRequestDto) =>
        this.execute(this._controller.update.bind(this._controller), req),
    });
  }
}
