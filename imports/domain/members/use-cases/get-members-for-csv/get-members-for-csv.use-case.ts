/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { GetMembersForCsvRequestDto } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv-request.dto';
import { MemberForCsvDto } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv.dto';
import { DIToken } from '@infra/di/di-tokens';
import { FindPaginatedMember } from '@infra/mongo/repositories/members/member-repository.types';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/money.utils';

@injectable()
export class GetMembersForCsvUseCase
  extends UseCase<GetMembersForCsvRequestDto>
  implements
    IUseCase<GetMembersForCsvRequestDto, PaginatedResponse<MemberForCsvDto>>
{
  public constructor(
    @inject(DIToken.MemberRepository)
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
        (member: FindPaginatedMember): MemberForCsvDto => ({
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
          electricityDebt: MoneyUtils.fromCents(member.electricityBalance),
          guestDebt: MoneyUtils.fromCents(member.guestBalance),
          membershipDebt: MoneyUtils.fromCents(member.membershipBalance),
          totalDebt: MoneyUtils.fromCents(member.totalBalance),
        }),
      ),
    });
  }
}
