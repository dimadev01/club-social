import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetMovementsGridRequestDto } from '@ui/dtos/get-movements-grid-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useGetMovementsToExport = () =>
  useMutation<GetMovementsGridRequestDto, MovementGridDto[]>({
    methodName: MeteorMethodEnum.MovementsGetToExport,
  });
