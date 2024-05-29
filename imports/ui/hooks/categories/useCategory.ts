import { useQuery } from '@tanstack/react-query';

import { GetCategoryRequestDto } from '@domain/categories/use-cases/get-category/get-category-request.dto';
import { GetCategoryResponseDto } from '@domain/categories/use-cases/get-category/get-category-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCategory = (id?: string) =>
  useQuery<GetCategoryRequestDto, Error, GetCategoryResponseDto | undefined>(
    [MeteorMethodEnum.CategoriesGetOne, id],
    () => Meteor.callAsync(MeteorMethodEnum.CategoriesGetOne, { id }),
    {
      enabled: !!id,
    },
  );
