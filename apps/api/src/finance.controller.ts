import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

function start(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function end(d: Date) { const s = start(d); return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1); }

@Controller()
export class FinanceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('adspend')
  async adspend(@Query('accountId') accountId?: string, @Query('date') dateStr?: string) {
    const base = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
    const gte = start(base), lt = end(base);
    return this.prisma.adspend.findMany({
      where: { ...(accountId ? { accountId } : {}), date: { gte, lt } },
      include: { account: { select: { id: true, platform: true } } },
      orderBy: { date: 'desc' },
    });
  }

  @Get('expenses')
  async expenses(@Query('accountId') accountId?: string, @Query('date') dateStr?: string) {
    const base = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
    const gte = start(base), lt = end(base);
    return this.prisma.expense.findMany({
      where: { ...(accountId ? { accountId } : {}), date: { gte, lt } },
      include: { account: { select: { id: true, platform: true } } },
      orderBy: { date: 'desc' },
    });
  }
}
