import { MovementDto } from '@application/movements/dtos/movement.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { UpdateMovementRequestDto } from '@ui/dtos/update-movement-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateMovement = () =>
  useMutation<UpdateMovementRequestDto, MovementDto>({
    methodName: MeteorMethodEnum.MovementsUpdate,
  });
