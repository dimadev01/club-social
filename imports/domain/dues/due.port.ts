import { ICrudPort } from '@application/ports/crud.port';
import { Due } from '@domain/dues/entities/due.entity';

export type IDuePort = ICrudPort<Due>;
