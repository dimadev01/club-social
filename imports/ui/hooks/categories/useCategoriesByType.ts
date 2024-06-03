import { GetCategoriesByTypeRequestDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-request.dto';
import { GetCategoriesByTypeResponseDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-response.dto';
import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CategoryTypeEnum } from '@domain/categories/category.enum';

export const useCategoriesByType = (type?: CategoryTypeEnum) =>
  useQuery<
    GetCategoriesByTypeRequestDto,
    Error,
    GetCategoriesByTypeResponseDto[]
  >(
    [type, MeteorMethodEnum.CategoriesGetAllByType],
    () => Meteor.callAsync(MeteorMethodEnum.CategoriesGetAllByType, { type }),
    { enabled: !!type },
  );
