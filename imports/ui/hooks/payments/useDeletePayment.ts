import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useDeletePayment = () =>
  useMutation<GetOneByIdRequestDto, null>({
    methodName: MeteorMethodEnum.PaymentsDelete,
  });
