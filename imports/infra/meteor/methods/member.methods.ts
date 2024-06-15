import { injectable } from 'tsyringe';

import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { MemberController } from '@ui/controllers/member.controller';
import { CreateMemberRequestDto } from '@ui/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@ui/dtos/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@ui/dtos/get-members-request.dto';
import { UpdateMemberRequestDto } from '@ui/dtos/update-member-request.dto';

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
