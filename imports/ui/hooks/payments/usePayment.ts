import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePayment = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, PaymentDto>({
    methodName: MeteorMethodEnum.PaymentsGet,
    request,
  });
