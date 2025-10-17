import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query('q') q?: string) {
    return this.prisma.account.findMany({
      where: q
        ? {
            OR: [
              { id: { contains: q } },
              { platform: { contains: q } },
              { user: { name: { contains: q } } },
            ],
          }
        : undefined,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
