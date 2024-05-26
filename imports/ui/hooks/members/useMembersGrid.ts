import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { UrlUtils } from '@shared/utils/url.utils';

export const useMembersGrid = (request: PaginatedRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<PaginatedRequestDto, Error, PaginatedResponse<MemberGridDto>>(
    [MethodsEnum.MembersGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.MembersGetGrid, request),
  );
};
