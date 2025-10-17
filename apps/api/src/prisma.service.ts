import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Evita o problema de tipos do $on('beforeExit') no Prisma 6
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      try {
        await app.close();
      } catch {}
    });
  }
}
