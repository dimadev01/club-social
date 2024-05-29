import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { GetUsersRequestDto } from '@domain/users/use-cases/get-users-grid/get-users-grid-request.dto';
import { GetUsersResponseDto } from '@domain/users/use-cases/get-users-grid/get-users-grid.response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';

export const useUsersGrid = (request: GetUsersRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<GetUsersRequestDto, Error, GetUsersResponseDto>(
    [MeteorMethodEnum.UsersGetGrid, request],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGetGrid, request),
  );
};
