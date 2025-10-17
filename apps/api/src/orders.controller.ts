import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

function start(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function end(d: Date) { const s = start(d); return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1); }

@Controller('orders')
export class OrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(
    @Query('accountId') accountId?: string,
    @Query('date') dateStr?: string, // YYYY-MM-DD
    @Query('status') status?: 'PENDING' | 'APPROVED' | 'REFUNDED',
  ) {
    const base = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
    const gte = start(base), lt = end(base);

    return this.prisma.order.findMany({
      where: {
        ...(accountId ? { accountId } : {}),
        ...(status ? { status } : {}),
        occurredAt: { gte, lt },
      },
      include: { account: { select: { id: true, platform: true } } },
      orderBy: { occurredAt: 'desc' },
    });
  }
}
