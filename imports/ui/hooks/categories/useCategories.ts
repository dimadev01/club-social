import { GetCategoriesResponseDto } from '@domain/categories/use-cases/get-categories/get-categories-response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () =>
  useQuery<undefined, Error, GetCategoriesResponseDto[]>(
    [MethodsEnum.CategoriesGetAll],
    () => Meteor.callAsync(MethodsEnum.CategoriesGetAll)
  );
