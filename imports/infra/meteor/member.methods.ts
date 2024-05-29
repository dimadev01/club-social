import { injectable } from 'tsyringe';

import { GetMemberDuesGridRequestDto } from '@domain/members/use-cases/get-member-dues-grid/get-member-dues-grid.request.dto';
import { GetMemberDuesGridUseCase } from '@domain/members/use-cases/get-member-dues-grid/get-member-dues-grid.use-case';
import { GetMemberMovementsGridRequestDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.request.dto';
import { GetMemberMovementsUseCase } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.use-case';
import { GetMemberPaymentsGridRequestDto } from '@domain/members/use-cases/get-member-payments-grid/get-member-payments-grid.request.dto';
import { GetMemberPaymentsGridUseCase } from '@domain/members/use-cases/get-member-payments-grid/get-member-payments-grid.use-case';
import { GetMembersUseCase } from '@domain/members/use-cases/get-members/get-members.use-case';
import { GetMembersForCsvRequestDto } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv-request.dto';
import { GetMembersForCsvUseCase } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MemberMethod extends MeteorMethod {
  public constructor(
    private readonly _getMembers: GetMembersUseCase,
    private readonly _getMembersForCsv: GetMembersForCsvUseCase,
    private readonly _getMemberMovements: GetMemberMovementsUseCase,
    private readonly _getMemberDuesGrid: GetMemberDuesGridUseCase,
    private readonly _getMemberPaymentsGrid: GetMemberPaymentsGridUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.MembersGet]: () => this.execute(this._getMembers),

      [MeteorMethodEnum.MembersGetForCsv]: (
        request: GetMembersForCsvRequestDto,
      ) =>
        this.execute(
          this._getMembersForCsv,
          request,
          GetMembersForCsvRequestDto,
        ),

      [MeteorMethodEnum.MembersGetMovementsGrid]: (
        request: GetMemberMovementsGridRequestDto,
      ) =>
        this.execute(
          this._getMemberMovements,
          request,
          GetMemberMovementsGridRequestDto,
        ),

      [MeteorMethodEnum.MembersGetDuesGrid]: (
        request: GetMemberDuesGridRequestDto,
      ) =>
        this.execute(
          this._getMemberDuesGrid,
          request,
          GetMemberDuesGridRequestDto,
        ),

      [MeteorMethodEnum.MembersGetPaymentsGrid]: (
        request: GetMemberPaymentsGridRequestDto,
      ) =>
        this.execute(
          this._getMemberPaymentsGrid,
          request,
          GetMemberPaymentsGridRequestDto,
        ),
    });
  }
}
