import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetPaymentsGridRequestDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.request.dto';
import { GetPaymentsGridResponseDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const usePaymentGrid = (request: GetPaymentsGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<GetPaymentsGridRequestDto, Error, GetPaymentsGridResponseDto>(
    [MethodsEnum.PaymentsGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.PaymentsGetGrid, request),
  );
};
