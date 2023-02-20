import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetMovementsRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-request.dto';
import { GetMovementsResponseDto } from '@domain/movements/use-cases/get-movements/get-movements.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMovementsGrid = (request: GetMovementsRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(
      qs.stringify(request, { arrayFormat: 'brackets', encode: false })
    );
  }, [request]);

  return useQuery<GetMovementsRequestDto, Error, GetMovementsResponseDto>(
    [MethodsEnum.MovementsGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.MovementsGetGrid, request)
  );
};
