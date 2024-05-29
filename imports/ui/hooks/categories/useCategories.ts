import { useQuery } from '@tanstack/react-query';

import { GetCategoriesResponseDto } from '@domain/categories/use-cases/get-categories/get-categories-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCategories = () =>
  useQuery<null, Error, GetCategoriesResponseDto[]>(
    [MeteorMethodEnum.CategoriesGetAll],
    () => Meteor.callAsync(MeteorMethodEnum.CategoriesGetAll),
  );
