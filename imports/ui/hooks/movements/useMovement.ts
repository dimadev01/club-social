import { MovementDto } from '@application/movements/dtos/movement.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMovement = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, MovementDto | null>({
    methodName: MeteorMethodEnum.MovementsGetOne,
    request,
  });
