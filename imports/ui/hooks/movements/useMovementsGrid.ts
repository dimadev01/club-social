import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const useMovementsGrid = (request: GetMovementsGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<
    GetMovementsGridRequestDto,
    Error,
    GetMovementsGridResponseDto
  >([MethodsEnum.MovementsGetGrid, request], () =>
    Meteor.callAsync(MethodsEnum.MovementsGetGrid, request),
  );
};
