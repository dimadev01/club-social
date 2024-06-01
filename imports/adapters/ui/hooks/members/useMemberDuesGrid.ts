import { GetMemberDuesGridRequestDto } from '@application/members/use-cases/get-member-dues-grid/get-member-dues-grid.request.dto';
import { GetMemberDuesGridResponseDto } from '@application/members/use-cases/get-member-dues-grid/get-member-dues-grid.response.dto';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';

export const useMemberDuesGrid = (request: GetMemberDuesGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<
    GetMemberDuesGridRequestDto,
    Error,
    GetMemberDuesGridResponseDto
  >([MeteorMethodEnum.MembersGetDuesGrid, request], () =>
    Meteor.callAsync(MeteorMethodEnum.MembersGetDuesGrid, request),
  );
};
