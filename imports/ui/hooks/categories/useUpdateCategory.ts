import { useMutation } from '@tanstack/react-query';

import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateCategory = () =>
  useMutation<null, Error, UpdateCategoryRequestDto>(
    [MeteorMethodEnum.CategoriesUpdate],
    (request) => Meteor.callAsync(MeteorMethodEnum.CategoriesUpdate, request),
  );
