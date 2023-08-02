import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { PaginatedRequestDto } from '@application/common/paginated-request.dto';
import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const useMembersGrid = (request: PaginatedRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request));
  }, [request]);

  return useQuery<PaginatedRequestDto, Error, PaginatedResponse<MemberGridDto>>(
    [MethodsEnum.MembersGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.MembersGetGrid, request)
  );
};
