import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesResponseDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';

export const usePaidDues = (request: GetPaidDuesRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<GetPaidDuesRequestDto, Error, GetPaidDuesResponseDto>(
    [MethodsEnum.DuesGetPaid, request],
    () => Meteor.callAsync(MethodsEnum.DuesGetPaid, request),
  );
};
