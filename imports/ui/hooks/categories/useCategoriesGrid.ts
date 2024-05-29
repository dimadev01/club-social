import { useQuery } from '@tanstack/react-query';

import { GetCategoriesGridRequestDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-request.dto';
import { GetCategoriesGridResponseDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCategoriesGrid = (request: GetCategoriesGridRequestDto) =>
  useQuery<GetCategoriesGridRequestDto, Error, GetCategoriesGridResponseDto>(
    [MeteorMethodEnum.CategoriesGetGrid, request],
    () => Meteor.callAsync(MeteorMethodEnum.CategoriesGetGrid, request),
  );
