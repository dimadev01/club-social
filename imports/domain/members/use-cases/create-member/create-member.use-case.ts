import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { InternalServerError } from '@application/errors/internal-server.error';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { Member } from '@domain/members/entities/member.entity';
import { IMemberPort } from '@domain/members/member.port';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { PermissionEnum, RoleEnum, ScopeEnum } from '@domain/roles/roles.enum';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { ErrorUtils } from '@shared/utils/error.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

@injectable()
export class CreateMemberUseCase
  extends UseCase<CreateMemberRequestDto>
  implements IUseCase<CreateMemberRequestDto, string>
{
  public constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: CreateMemberRequestDto
  ): Promise<Result<string, Error>> {
    const session = MongoUtils.startSession();

    try {
      let newMemberId: string | null = null;

      await session.withTransaction(async () => {
        await this.validatePermission(ScopeEnum.Members, PermissionEnum.Create);

        const createUserResult = await this._createUserUseCase.execute({
          emails: request.emails,
          firstName: request.firstName,
          lastName: request.lastName,
          role: RoleEnum.Member,
        });

        if (createUserResult.isErr()) {
          throw createUserResult.error;
        }

        const memberResult = Member.create({
          address: {
            cityGovId: request.addressCityGovId,
            cityName: request.addressCityName,
            stateGovId: request.addressStateGovId,
            stateName: request.addressStateName,
            street: request.addressStreet,
            zipCode: request.addressZipCode,
          },
          category: request.category,
          dateOfBirth: request.dateOfBirth,
          documentID: request.documentID,
          fileStatus: request.fileStatus,
          maritalStatus: request.maritalStatus,
          nationality: request.nationality,
          phones: request.phones,
          sex: request.sex,
          status: request.status,
          userId: createUserResult.value,
        });

        if (memberResult.isErr()) {
          throw memberResult.error;
        }

        await this._memberPort.createWithSession(memberResult.value, session);

        this._logger.info('Member created', { member: memberResult.value });

        newMemberId = memberResult.value._id;
      });

      if (!newMemberId) {
        throw new InternalServerError();
      }

      return ok(newMemberId);
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await session.endSession();
    }
  }
}
