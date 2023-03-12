import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
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
