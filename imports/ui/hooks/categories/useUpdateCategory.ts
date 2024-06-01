import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';

export const useUpdateCategory = () =>
  useMutation<null, Error, UpdateCategoryRequestDto>(
    [MeteorMethodEnum.CategoriesUpdate],
    (request) => Meteor.callAsync(MeteorMethodEnum.CategoriesUpdate, request),
  );
