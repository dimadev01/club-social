import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { IMemberPort } from '@domain/members/member.port';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/money.utils';
import { GetMemberDuesGridRequestDto } from './get-member-dues-grid.request.dto';
import { GetMemberDuesGridResponseDto } from './get-member-dues-grid.response.dto';
import { MemberDueGridDto } from './member-due-grid.dto';

@injectable()
export class GetMemberDuesGridUseCase
  extends UseCase<GetMemberDuesGridRequestDto>
  implements
    IUseCase<GetMemberDuesGridRequestDto, GetMemberDuesGridResponseDto>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: GetMemberDuesGridRequestDto
  ): Promise<Result<GetMemberDuesGridResponseDto, Error>> {
    const loggedInMember = await this._memberPort.getLoggedInOrThrow();

    const { data, count, totalDues, totalPayments, balance } =
      await this._duePort.findPaginated({
        ...request,
        memberIds: [loggedInMember._id],
        showDeleted: false,
      });

    return ok<GetMemberDuesGridResponseDto>({
      balance: MoneyUtils.formatCents(balance),
      count,
      data: data.map(
        (due: Due): MemberDueGridDto => ({
          _id: due._id,
          amount: due.amountFormatted,
          category: due.category,
          date: due.dateFormatted,
          debtAmount: due.getPendingAmountFormatted(),
          isDeleted: due.isDeleted,
          isPaid: due.isPaid(),
          isPartiallyPaid: due.isPartiallyPaid(),
          isPending: due.isPending(),
          membershipMonth: due.membershipMonth,
          paidAmount: due.paidAmountFormatted,
          payments:
            due.payments?.map((duePayment) => ({
              amount: duePayment.amountFormatted,
              paidAt: duePayment.dateFormatted,
            })) ?? null,
          status: due.status,
        })
      ),
      totalDues: MoneyUtils.formatCents(totalDues),
      totalPayments: MoneyUtils.formatCents(totalPayments),
    });
  }
}
