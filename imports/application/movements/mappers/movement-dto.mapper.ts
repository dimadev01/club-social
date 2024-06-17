import { injectable } from 'tsyringe';

import { MovementDto } from '@application/movements/dtos/movement.dto';
import { Movement } from '@domain/movements/models/movement.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class MovementDtoMapper extends MapperDto<Movement, MovementDto> {
  public toDto(movement: Movement): MovementDto {
    return {
      amount: movement.amount.value,
      category: movement.category,
      createdAt: movement.createdAt.toISOString(),
      createdBy: movement.createdBy,
      date: movement.date.toISOString(),
      employeeId: movement.employeeId,
      id: movement._id,
      isRegistered: movement.isRegistered(),
      isUpdatable: movement.isUpdatable(),
      isVoidable: movement.isVoidable(),
      isVoided: movement.isVoided(),
      notes: movement.notes,
      paymentId: movement.paymentId,
      professorId: movement.professorId,
      serviceId: movement.serviceId,
      status: movement.status,
      type: movement.type,
      voidReason: movement.voidReason,
      voidedAt: movement.voidedAt?.toISOString() ?? null,
      voidedBy: movement.voidedBy,
    };
  }
}
