import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetMemberDuesGridRequestDto } from '@domain/members/use-cases/get-member-dues-grid/get-member-dues-grid.request.dto';
import { GetMemberDuesGridResponseDto } from '@domain/members/use-cases/get-member-dues-grid/get-member-dues-grid.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const useMemberDuesGrid = (request: GetMemberDuesGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<
    GetMemberDuesGridRequestDto,
    Error,
    GetMemberDuesGridResponseDto
  >([MethodsEnum.MembersGetDuesGrid, request], () =>
    Meteor.callAsync(MethodsEnum.MembersGetDuesGrid, request)
  );
};
