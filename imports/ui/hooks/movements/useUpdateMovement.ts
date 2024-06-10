import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { UpdateMovementRequestDto } from '@adapters/dtos/update-movement-request.dto';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateMovement = () =>
  useMutation<UpdateMovementRequestDto, MovementDto>({
    methodName: MeteorMethodEnum.MovementsUpdate,
  });
