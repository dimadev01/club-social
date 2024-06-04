import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { CreateMemberRequest } from '@application/members/use-cases/create-member/create-member.request';
import { CreateMemberResponse } from '@application/members/use-cases/create-member/create-member.response';
import { CreateUserUseCase } from '@application/users/use-cases/create-user/create-user.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { ExistingMemberByDocumentError } from '@domain/members/errors/existing-member-by-document.error';
import { Member } from '@domain/members/models/member.model';
import { IMemberRepository } from '@domain/members/repositories/member.repository';
import { RoleEnum } from '@domain/roles/role.enum';

@injectable()
export class CreateMemberUseCase
  implements IUseCase<CreateMemberRequest, CreateMemberResponse>
{
  public constructor(
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    private readonly _createUserUseCase: CreateUserUseCase,
  ) {}

  public async execute(
    request: CreateMemberRequest,
  ): Promise<Result<CreateMemberResponse, Error>> {
    if (request.documentID) {
      const existingMemberByDocument =
        await this._memberRepository.findByDocument(request.documentID);

      if (existingMemberByDocument) {
        return err(new ExistingMemberByDocumentError(request.documentID));
      }
    }

    try {
      this._unitOfWork.start();

      let newMember: Member | undefined;

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const userResult = await this._createUserUseCase.execute({
          emails: request.emails?.map((email) => email) ?? null,
          firstName: request.firstName,
          lastName: request.lastName,
          role: RoleEnum.MEMBER,
          unitOfWork,
        });

        if (userResult.isErr()) {
          throw userResult.error;
        }

        const member = Member.createOne({
          address: {
            cityGovId: request.addressCityGovId,
            cityName: request.addressCityName,
            stateGovId: request.addressStateGovId,
            stateName: request.addressStateName,
            street: request.addressStreet,
            zipCode: request.addressZipCode,
          },
          birthDate: request.birthDate
            ? new BirthDate(request.birthDate)
            : null,
          category: request.category,
          documentID: request.documentID,
          fileStatus: request.fileStatus,
          maritalStatus: request.maritalStatus,
          nationality: request.nationality,
          phones: request.phones,
          sex: request.sex,
          userId: userResult.value._id,
        });

        if (member.isErr()) {
          throw member.error;
        }

        await this._memberRepository.insertWithSession(
          member.value,
          unitOfWork,
        );

        newMember = member.value;
      });

      invariant(newMember);

      return ok(newMember);
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
