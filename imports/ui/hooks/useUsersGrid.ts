import { GetUsersRequestDto } from '@domain/users/use-cases/get-users/get-users-request.dto';
import { GetUsersResponseDto } from '@domain/users/use-cases/get-users/get-users.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useUsersGrid = (request: GetUsersRequestDto) =>
  useQuery<GetUsersRequestDto, Error, GetUsersResponseDto>(
    [MethodsEnum.UsersGet, request],
    () => Meteor.callAsync(MethodsEnum.UsersGet, request)
  );
