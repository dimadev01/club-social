import { GetMovementsByMemberGridRequestDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.request.dto';
import { GetMovementsByMemberGridResponseDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMovementsByMemberGrid = (
  request: GetMovementsByMemberGridRequestDto
) =>
  useQuery<
    GetMovementsByMemberGridRequestDto,
    Error,
    GetMovementsByMemberGridResponseDto
  >([MethodsEnum.MovementsByMemberGetGrid, request], () =>
    Meteor.callAsync(MethodsEnum.MovementsByMemberGetGrid, request)
  );
