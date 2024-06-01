import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetCategoryRequestDto } from '@domain/categories/use-cases/get-category/get-category-request.dto';
import { GetCategoryResponseDto } from '@domain/categories/use-cases/get-category/get-category-response.dto';

export const useCategory = (id?: string) =>
  useQuery<GetCategoryRequestDto, Error, GetCategoryResponseDto | undefined>(
    [MeteorMethodEnum.CategoriesGetOne, id],
    () => Meteor.callAsync(MeteorMethodEnum.CategoriesGetOne, { id }),
    {
      enabled: !!id,
    },
  );
