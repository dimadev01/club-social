import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { PaymentModelDto } from '@application/payments/dtos/payment-model.dto';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';

export const usePayment = (id?: string) =>
  useQuery<FindOneModelByIdRequest, Error, PaymentModelDto | undefined>(
    [MeteorMethodEnum.PaymentsGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.PaymentsGet, { id }),
    { enabled: !!id },
  );
