import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users/get-users-request.dto';
import { GetUsersResponseDto } from '@domain/users/use-cases/get-users/get-users.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useUsersGrid = (request: GetUsersRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(
      qs.stringify(request, { arrayFormat: 'brackets', encode: false })
    );
  }, [request]);

  return useQuery<GetUsersRequestDto, Error, GetUsersResponseDto>(
    [MethodsEnum.UsersGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.UsersGetGrid, request)
  );
};
