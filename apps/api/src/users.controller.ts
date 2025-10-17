import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query('q') q?: string) {
    return this.prisma.user.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : undefined,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
