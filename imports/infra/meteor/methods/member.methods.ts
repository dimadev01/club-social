import { container } from 'tsyringe';

import { CreateMemberUseCase } from '@application/members/use-cases/create-member/create-member.use-case';
import { GetMembersGridUseCase } from '@application/members/use-cases/ger-members-grid/get-members-grid.use-case';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { GetMembersUseCase } from '@application/members/use-cases/get-members/get-members.use-case';
import { GetMembersToExportUseCase } from '@application/members/use-cases/get-members-export/get-members-export.use-case';
import { UpdateMemberUseCase } from '@application/members/use-cases/update-member/update-member.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateMemberRequestDto } from '@ui/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@ui/dtos/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@ui/dtos/get-members-request.dto';
import { UpdateMemberRequestDto } from '@ui/dtos/update-member-request.dto';

export class MemberMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MembersGet]: (req: GetMembersRequestDto) =>
        this.execute(
          container.resolve(GetMembersUseCase),
          GetMembersRequestDto,
          req,
        ),

      [MeteorMethodEnum.MembersGetGrid]: (req: GetMembersGridRequestDto) =>
        this.execute(
          container.resolve(GetMembersGridUseCase),
          GetMembersGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.MembersCreate]: (req: CreateMemberRequestDto) =>
        this.execute(
          container.resolve(CreateMemberUseCase),
          CreateMemberRequestDto,
          req,
        ),

      [MeteorMethodEnum.MembersGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetMemberUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.MembersGetToExport]: (req: GetMembersGridRequestDto) =>
        this.execute(
          container.resolve(GetMembersToExportUseCase),
          GetMembersGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.MembersUpdate]: (req: UpdateMemberRequestDto) =>
        this.execute(
          container.resolve(UpdateMemberUseCase),
          UpdateMemberRequestDto,
          req,
        ),
    });
  }
}
