import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { VoidMovementMethodRequestDto } from '@infra/meteor/dtos/void-movement-method-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useVoidMovement = () =>
  useMutation<VoidMovementMethodRequestDto, null>({
    methodName: MeteorMethodEnum.MovementsVoid,
  });
