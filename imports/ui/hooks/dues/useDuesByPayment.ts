import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetDuesByPaymentRequestDto } from '@adapters/dtos/get-dues-by-payment-request.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { useQuery } from '@ui/hooks/useQuery';

export const useDuesByPayment = (request?: GetDuesByPaymentRequestDto) =>
  useQuery<GetDuesByPaymentRequestDto, DueDto[]>({
    methodName: MeteorMethodEnum.DuesGetByPayment,
    request,
  });
