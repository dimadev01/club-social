import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users-grid/get-users-grid-request.dto';
import { GetUsersResponseDto } from '@domain/users/use-cases/get-users-grid/get-users-grid.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const useUsersGrid = (request: GetUsersRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request));
  }, [request]);

  return useQuery<GetUsersRequestDto, Error, GetUsersResponseDto>(
    [MethodsEnum.UsersGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.UsersGetGrid, request)
  );
};
