import { injectable } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { Movement } from '@domain/movements/models/movement.model';

@injectable()
export class MovementDtoMapper extends MapperDto<Movement, MovementDto> {
  public toDto(movement: Movement): MovementDto {
    return {
      amount: movement.amount.value,
      category: movement.category,
      date: movement.date.toISOString(),
      employeeId: movement.employeeId,
      id: movement._id,
      notes: movement.notes,
      paymentId: movement.paymentId,
      professorId: movement.professorId,
      serviceId: movement.serviceId,
      type: movement.type,
    };
  }
}
