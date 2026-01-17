import { WriteableRepository } from '@/shared/domain/repository';

import { EmailSuppressionEntity } from './entities/email-suppression.entity';

export const EMAIL_SUPPRESSION_REPOSITORY_PROVIDER = Symbol(
  'EmailSuppressionRepository',
);

export interface EmailSuppressionRepository extends WriteableRepository<EmailSuppressionEntity> {
  findByEmail(email: string): Promise<EmailSuppressionEntity | null>;
  isEmailSuppressed(email: string): Promise<boolean>;
}
