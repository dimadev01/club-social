import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePayment = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, PaymentDto>({
    methodName: MeteorMethodEnum.PaymentsGetOne,
    request,
  });
