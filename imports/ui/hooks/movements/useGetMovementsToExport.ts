import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useGetMovementsToExport = () =>
  useMutation<GetMovementsGridRequestDto, MovementGridDto[]>({
    methodName: MeteorMethodEnum.MovementsGetToExport,
  });
