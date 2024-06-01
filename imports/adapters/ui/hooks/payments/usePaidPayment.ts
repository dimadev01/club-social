import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesResponseDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.response.dto';
import { UrlUtils } from '@shared/utils/url.utils';

export const usePaidDues = (request: GetPaidDuesRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<GetPaidDuesRequestDto, Error, GetPaidDuesResponseDto>(
    [MeteorMethodEnum.DuesGetPaid, request],
    () => Meteor.callAsync(MeteorMethodEnum.DuesGetPaid, request),
  );
};
