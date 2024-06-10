import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateMovementRequestDto } from '@adapters/dtos/create-movement-request.dto';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateMovement = () =>
  useMutation<CreateMovementRequestDto, MovementDto>({
    methodName: MeteorMethodEnum.MovementsCreate,
  });
