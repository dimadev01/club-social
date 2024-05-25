import { GetCategoryRequestDto } from '@domain/categories/use-cases/get-category/get-category-request.dto';
import { GetCategoryResponseDto } from '@domain/categories/use-cases/get-category/get-category-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useCategory = (id?: string) =>
  useQuery<GetCategoryRequestDto, Error, GetCategoryResponseDto | undefined>(
    [MethodsEnum.CategoriesGetOne, id],
    () => Meteor.callAsync(MethodsEnum.CategoriesGetOne, { id }),
    {
      enabled: !!id,
    },
  );
