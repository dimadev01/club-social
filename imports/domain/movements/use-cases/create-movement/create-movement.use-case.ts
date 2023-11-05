import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { IEmailService } from '@application/notifications/email.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import {
  CategoryLabel,
  MemberCategories,
} from '@domain/categories/category.enum';
import { Member } from '@domain/members/entities/member.entity';
import { MembersCollection } from '@domain/members/member.collection';
import { Movement } from '@domain/movements/entities/movement.entity';
import { IMovementPort } from '@domain/movements/movement.port';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { ErrorUtils } from '@shared/utils/error.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

@injectable()
export class CreateMovementUseCase
  extends UseCase<CreateMovementRequestDto>
  implements IUseCase<CreateMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort,
    @inject(DIToken.EmailService)
    private readonly _emailService: IEmailService
  ) {
    super();
  }

  public async execute(
    request: CreateMovementRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(Scope.Movements, Permission.Create);

    if (MemberCategories.includes(request.category)) {
      const result = await this._createWithMember(request);

      if (result.isErr()) {
        return err(result.error);
      }

      return ok(null);
    }

    const movement = Movement.create({
      amount: request.amount,
      category: request.category,
      date: request.date,
      employeeId: request.employeeId,
      memberId: null,
      notes: request.notes,
      professorId: request.professorId,
      serviceId: request.serviceId,
      type: request.type,
    });

    await this._movementPort.create(movement);

    this._logger.info('Movement created', { movement });

    return ok(null);
  }

  private async _createWithMember(
    request: CreateMovementRequestDto
  ): Promise<Result<null, Error>> {
    if (!request.memberIds || request.memberIds.length === 0) {
      return err(new Error('No members selected'));
    }

    const session = MongoUtils.startSession();

    try {
      await Promise.all(
        request.memberIds.map(async (memberId: string) => {
          await session.withTransaction(async () => {
            const movement = Movement.create({
              amount: request.amount,
              category: request.category,
              date: request.date,
              employeeId: request.employeeId,
              memberId,
              notes: request.notes,
              professorId: request.professorId,
              serviceId: request.serviceId,
              type: request.type,
            });

            await this._movementPort.createWithSession(movement, session);

            const member = await MembersCollection.findOneAsync(memberId);

            if (!member) {
              throw new EntityNotFoundError(Member);
            }

            member.joinUser();

            const memberEmail = member.getEmail();

            if (memberEmail) {
              await this._emailService.send({
                message: `Hola ${
                  member.name
                }, te queremos informar desde el Club Social Monte Grande que se ha registrado un nuevo movimiento por ${
                  movement.amountFormatted
                } en tu cuenta en concepto de ${
                  CategoryLabel[movement.category]
                } con fecha de ${movement.dateFormatted}. Administración`,
                subject: `Nuevo movimiento en tu cuenta [${
                  CategoryLabel[movement.category]
                }]`,
                to: memberEmail,
              });
            }

            await session.commitTransaction();
          });
        })
      );

      return ok(null);
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await session.endSession();
    }
  }
}
