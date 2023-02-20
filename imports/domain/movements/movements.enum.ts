/* eslint-disable typescript-sort-keys/string-enum */
export enum MovementCategory {
  Membership = 'membership',
}

export const MovementCategoryLabel = {
  [MovementCategory.Membership]: 'Cuota',
};

export const getMovementCategoryOptions = () =>
  Object.values(MovementCategory).map((category) => ({
    label: MovementCategoryLabel[category],
    value: category,
  }));

export const getMovementCategoryFilters = () =>
  Object.values(MovementCategory).map((category) => ({
    text: MovementCategoryLabel[category],
    value: category,
  }));
