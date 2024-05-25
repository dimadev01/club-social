import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateCategory = () =>
  useMutation<null, Error, UpdateCategoryRequestDto>(
    [MethodsEnum.CategoriesUpdate],
    (request) => Meteor.callAsync(MethodsEnum.CategoriesUpdate, request),
  );
