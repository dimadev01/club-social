import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';

export const useDeletePayment = (onSuccess: () => void) =>
  useMutation<null, Error, FindOneModelByIdRequest>(
    [MeteorMethodEnum.PaymentsDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.PaymentsDelete, request),
    { onSuccess: () => onSuccess() },
  );
