/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IMemberPort } from '@domain/members/member.port';
import { GetMembersForCsvRequestDto } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv-request.dto';
import { MemberForCsvDto } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv.dto';
import { FindPaginatedMemberOld } from '@infra/mongo/repositories/members/member-mongo-repository.types';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/money.utils';

@injectable()
export class GetMembersForCsvUseCase
  extends UseCase<GetMembersForCsvRequestDto>
  implements
    IUseCaseOld<GetMembersForCsvRequestDto, PaginatedResponse<MemberForCsvDto>>
{
  public constructor(
    @inject(DIToken.MemberRepositoryOld)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(
    request: GetMembersForCsvRequestDto,
  ): Promise<Result<PaginatedResponse<MemberForCsvDto>, Error>> {
    const { count, data } = await this._memberPort.findPaginated({
      ...request,
      findForCsv: true,
    });

    return ok<PaginatedResponse<MemberForCsvDto>>({
      count,
      data: data.map(
        (member: FindPaginatedMemberOld): MemberForCsvDto => ({
          _id: member._id,
          name: `${member.user.profile?.lastName ?? ''} ${
            member.user.profile?.firstName ?? ''
          }`,
          category: member.category,
          status: member.status,
          phone: member.phones?.[0] ?? null,
          emails: member.user.emails
            ? member.user.emails.map((email) => email.address)
            : null,
          electricityDebt: MoneyUtils.fromCents(member.pendingGuest),
          guestDebt: MoneyUtils.fromCents(member.pendingGuest),
          membershipDebt: MoneyUtils.fromCents(member.pendingMembership),
          totalDebt: MoneyUtils.fromCents(member.pendingTotal),
        }),
      ),
    });
  }
}
