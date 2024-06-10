import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMovement = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, MovementDto | null>({
    methodName: MeteorMethodEnum.MovementsGetOne,
    request,
  });
