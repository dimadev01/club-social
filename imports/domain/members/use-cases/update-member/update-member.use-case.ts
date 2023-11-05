import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { UpdateUserUseCase } from '@domain/users/use-cases/update-user/update-user.use-case';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { ErrorUtils } from '@shared/utils/error.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

@injectable()
export class UpdateMemberUseCase
  extends UseCase<UpdateMemberRequestDto>
  implements IUseCase<UpdateMemberRequestDto, null>
{
  public constructor(
    private readonly _updateUser: UpdateUserUseCase,
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: UpdateMemberRequestDto
  ): Promise<Result<null, Error>> {
    const session = MongoUtils.startSession();

    try {
      await session.withTransaction(async () => {
        await this.validatePermission(Scope.Members, Permission.Update);

        const member = await this._memberPort.findOneByIdOrThrow(request.id);

        const updateUserResult = await this._updateUser.execute({
          emails: request.emails,
          firstName: request.firstName,
          id: member.userId,
          lastName: request.lastName,
        });

        if (updateUserResult.isErr()) {
          throw updateUserResult.error;
        }

        const updateMemberResult: Result<null[], Error> = Result.combine([
          member.setDateOfBirth(
            request.dateOfBirth ? new Date(request.dateOfBirth) : null
          ),
          member.setCategory(request.category),
          member.setDocumentID(request.documentID),
          member.setFileStatus(request.fileStatus),
          member.setMaritalStatus(request.maritalStatus),
          member.setNationality(request.nationality),
          member.setPhones(request.phones),
          member.setSex(request.sex),
          member.setStatus(request.status),
          member.setAddress({
            cityGovId: request.addressCityGovId,
            cityName: request.addressCityName,
            stateGovId: request.addressStateGovId,
            stateName: request.addressStateName,
            street: request.addressStreet,
            zipCode: request.addressZipCode,
          }),
        ]);

        if (updateMemberResult.isErr()) {
          throw updateMemberResult.error;
        }

        await this._memberPort.updateWithSession(member, session);

        this._logger.info('Member updated', { memberId: request.id });
      });

      return ok(null);
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await session.endSession();
    }
  }
}
