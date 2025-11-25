import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { ConfigService } from '../config/config.service';
import { PrismaClient } from './generated/client';

@Injectable()
export class PrismaService extends PrismaClient {
  public constructor(protected readonly configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.databaseUrl,
    });

    super({ adapter });
  }
}
