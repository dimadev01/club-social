import { CategoryTypeEnum } from '@domain/categories/category.enum';
import { GetCategoriesByTypeRequestDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-request.dto';
import { GetCategoriesByTypeResponseDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useCategoriesByType = (type?: CategoryTypeEnum) =>
  useQuery<
    GetCategoriesByTypeRequestDto,
    Error,
    GetCategoriesByTypeResponseDto[]
  >(
    [type, MethodsEnum.CategoriesGetAllByType],
    () => Meteor.callAsync(MethodsEnum.CategoriesGetAllByType, { type }),
    { enabled: !!type },
  );
