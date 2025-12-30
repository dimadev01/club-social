import { SetMetadata } from '@nestjs/common';

export const SKIP_MAINTENANCE_CHECK_KEY = Symbol('skipMaintenanceCheck');
export const SkipMaintenanceCheck = () =>
  SetMetadata(SKIP_MAINTENANCE_CHECK_KEY, true);
