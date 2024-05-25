import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { InternalServerError } from '@application/errors/internal-server.error';
import { ILogger } from '@application/logger/logger.interface';
import { IEmailService } from '@application/notifications/email.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import {
  CategoryLabel,
  MemberCategories,
} from '@domain/categories/category.enum';
import { IMemberPort } from '@domain/members/member.port';
import { Movement } from '@domain/movements/entities/movement.entity';
import { IMovementPort } from '@domain/movements/movement.port';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
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
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort,
    @inject(DIToken.EmailService)
    private readonly _emailService: IEmailService,
  ) {
    super();
  }

  public async execute(
    request: CreateMovementRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Create);

    if (MemberCategories.includes(request.category)) {
      return this._createWithMember(request);
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

    if (movement.isErr()) {
      return err(movement.error);
    }

    await this._movementPort.create(movement.value);

    this._logger.info('Movement created', { movement: movement.value });

    return ok(null);
  }

  private async _createWithMember(
    request: CreateMovementRequestDto,
  ): Promise<Result<null, Error>> {
    const session = MongoUtils.startSession();

    try {
      await session.withTransaction(async () => {
        if (!request.memberIds || request.memberIds.length === 0) {
          throw new InternalServerError('No members selected');
        }

        await Promise.all(
          request.memberIds.map(async (memberId: string) => {
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

            if (movement.isErr()) {
              throw movement.error;
            }

            await this._movementPort.createWithSession(movement.value, session);

            const member = await this._memberPort.findOneByIdOrThrow(memberId);

            const memberEmail = member.getEmail();

            if (memberEmail) {
              await this._emailService.send({
                message: `Hola ${
                  member.name
                }, te queremos informar desde el Club Social Monte Grande que se ha registrado un nuevo movimiento por ${
                  movement.value.amountFormatted
                } en tu cuenta en concepto de ${
                  CategoryLabel[movement.value.category]
                } con fecha de ${movement.value.dateFormatted}. Administración`,
                subject: `Nuevo movimiento en tu cuenta [${
                  CategoryLabel[movement.value.category]
                }]`,
                to: memberEmail,
              });
            }
          }),
        );
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
