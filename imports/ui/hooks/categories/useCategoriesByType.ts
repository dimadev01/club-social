import { useQuery } from '@tanstack/react-query';

import { CategoryTypeEnum } from '@domain/categories/category.enum';
import { GetCategoriesByTypeRequestDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-request.dto';
import { GetCategoriesByTypeResponseDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

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
