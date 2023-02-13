import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetMembersRequestDto } from '@domain/members/use-cases/get-members/get-members-request.dto';
import { GetMembersResponseDto } from '@domain/members/use-cases/get-members/get-members.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMembersGrid = (request: GetMembersRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(
      qs.stringify(request, { arrayFormat: 'brackets', encode: false })
    );
  }, [request]);

  return useQuery<GetMembersRequestDto, Error, GetMembersResponseDto>(
    [MethodsEnum.MembersGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.MembersGetGrid, request)
  );
};
