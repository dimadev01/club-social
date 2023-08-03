import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useEmployees = (enabled = true) =>
  useQuery<undefined, Error, GetEmployeesResponseDto[]>(
    [MethodsEnum.EmployeesGetAll],
    () => Meteor.callAsync(MethodsEnum.EmployeesGetAll),
    { enabled }
  );
