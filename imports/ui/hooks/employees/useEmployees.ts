import { useQuery } from '@tanstack/react-query';

import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useEmployees = (enabled = true) =>
  useQuery<null, Error, GetEmployeesResponseDto[]>(
    [MethodsEnum.EmployeesGetAll],
    () => Meteor.callAsync(MethodsEnum.EmployeesGetAll),
    { enabled },
  );
