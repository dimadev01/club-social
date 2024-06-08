import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { UrlUtils } from '@shared/utils/url.utils';

export const useMovementsGrid = (request: GetMovementsGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<
    GetMovementsGridRequestDto,
    Error,
    GetMovementsGridResponseDto
  >([MeteorMethodEnum.MovementsGetGrid, request], () =>
    Meteor.callAsync(MeteorMethodEnum.MovementsGetGrid, request),
  );
};
