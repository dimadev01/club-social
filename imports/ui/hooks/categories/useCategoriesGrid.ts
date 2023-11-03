import { GetCategoriesGridRequestDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-request.dto';
import { GetCategoriesGridResponseDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useCategoriesGrid = (request: GetCategoriesGridRequestDto) =>
  useQuery<GetCategoriesGridRequestDto, Error, GetCategoriesGridResponseDto>(
    [MethodsEnum.CategoriesGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.CategoriesGetGrid, request)
  );
