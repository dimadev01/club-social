import { GetRentalsResponseDto } from '@domain/rentals/use-cases/get-rentals/get-rentals-response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useRentals = (enabled = true) =>
  useQuery<undefined, Error, GetRentalsResponseDto[]>(
    [MethodsEnum.RentalsGetAll],
    () => Meteor.callAsync(MethodsEnum.RentalsGetAll),
    { enabled }
  );
