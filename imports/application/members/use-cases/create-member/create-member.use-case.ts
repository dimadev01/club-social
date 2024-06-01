import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { InternalServerError } from '@application/errors/internal-server.error';
import { MemberModelDto } from '@application/members/dtos/member-model-dto';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import { ExistingMemberByDocumentError } from '@domain/members/errors/existing-member-by-document.error';
import { CreateMemberRequest } from '@domain/members/member.types';
import { MemberModel } from '@domain/members/models/member.model';
import { IMemberRepository } from '@domain/members/repositories/member.repository';
import { RoleEnum } from '@domain/roles/role.enum';
import { CreateUserNewUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';

@injectable()
export class CreateMemberUseCase<TSession>
  implements IUseCase<CreateMemberRequest, MemberModelDto>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository<TSession>,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork<TSession>,
    private readonly _createUserUseCase: CreateUserNewUseCase<TSession>,
    private readonly _getMemberUseCase: GetMemberUseCase,
  ) {}

  public async execute(
    request: CreateMemberRequest,
  ): Promise<Result<MemberModelDto, Error>> {
    if (request.documentID) {
      const existingMemberByDocument =
        await this._memberRepository.findByDocument(request.documentID);

      if (existingMemberByDocument) {
        return err(new ExistingMemberByDocumentError(request.documentID));
      }
    }

    try {
      this._unitOfWork.start();

      let newMemberId: string | undefined;

      await this._unitOfWork.withTransaction(async (session) => {
        const userResult = await this._createUserUseCase.execute({
          emails: request.emails?.map((email) => email) ?? null,
          firstName: request.firstName,
          lastName: request.lastName,
          role: RoleEnum.MEMBER,
          unitOfWork: this._unitOfWork,
        });

        if (userResult.isErr()) {
          throw userResult.error;
        }

        const member = MemberModel.createOne({
          address: {
            cityGovId: request.addressCityGovId,
            cityName: request.addressCityName,
            stateGovId: request.addressStateGovId,
            stateName: request.addressStateName,
            street: request.addressStreet,
            zipCode: request.addressZipCode,
          },
          birthDate: request.dateOfBirth,
          category: request.category,
          documentID: request.documentID,
          fileStatus: request.fileStatus,
          maritalStatus: request.maritalStatus,
          nationality: request.nationality,
          phones: request.phones,
          sex: request.sex,
          userId: userResult.value.id,
        });

        if (member.isErr()) {
          throw member.error;
        }

        await this._memberRepository.insertWithSession(member.value, session);

        newMemberId = member.value._id;
      });

      invariant(newMemberId);

      const member = await this._getMemberUseCase.execute({
        id: newMemberId,
      });

      if (member.isErr()) {
        return err(member.error);
      }

      invariant(member.value);

      return ok(member.value);
    } catch (error) {
      if (error instanceof Error) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
