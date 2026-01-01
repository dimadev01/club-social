export const FeatureFlag = {
  MAINTENANCE_MODE: 'maintenance-mode',
} as const;

export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];
