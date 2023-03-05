import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMovementsGrid = (request: GetMovementsGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(qs.stringify(request, { skipNulls: true }));
  }, [request]);

  return useQuery<
    GetMovementsGridRequestDto,
    Error,
    GetMovementsGridResponseDto
  >([MethodsEnum.MovementsGetGrid, request], () =>
    Meteor.callAsync(MethodsEnum.MovementsGetGrid, request)
  );
};
