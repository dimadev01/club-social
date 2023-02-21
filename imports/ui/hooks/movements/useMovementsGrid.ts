import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { useQuery } from '@tanstack/react-query';

export const useMovementsGrid = (request: PaginatedRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(
      qs.stringify(request, { arrayFormat: 'brackets', encode: false })
    );
  }, [request]);

  return useQuery<
    PaginatedRequestDto,
    Error,
    PaginatedResponse<MovementGridDto>
  >([MethodsEnum.MovementsGetGrid, request], () =>
    Meteor.callAsync(MethodsEnum.MovementsGetGrid, request)
  );
};
