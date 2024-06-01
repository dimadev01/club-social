import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetCategoriesResponseDto } from '@domain/categories/use-cases/get-categories/get-categories-response.dto';

export const useCategories = () =>
  useQuery<null, Error, GetCategoriesResponseDto[]>(
    [MeteorMethodEnum.CategoriesGetAll],
    () => Meteor.callAsync(MeteorMethodEnum.CategoriesGetAll),
  );
