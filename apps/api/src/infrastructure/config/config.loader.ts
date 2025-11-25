import { z } from 'zod';

import { configSchema } from './config.schema';

export default () => {
  const parsed = configSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      'Invalid environment variables:',
      JSON.stringify(z.treeifyError(parsed.error)),
    );
    process.exit(1);
  }

  return parsed.data;
};
