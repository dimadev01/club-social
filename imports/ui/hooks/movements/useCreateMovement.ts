import { MovementDto } from '@application/movements/dtos/movement.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateMovementRequestDto } from '@ui/dtos/create-movement-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateMovement = () =>
  useMutation<CreateMovementRequestDto, MovementDto>({
    methodName: MeteorMethodEnum.MovementsCreate,
  });
