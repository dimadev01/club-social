import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';

export const useEmployees = (enabled = true) =>
  useQuery<null, Error, GetEmployeesResponseDto[]>(
    [MeteorMethodEnum.EmployeesGetAll],
    () => Meteor.callAsync(MeteorMethodEnum.EmployeesGetAll),
    { enabled },
  );
