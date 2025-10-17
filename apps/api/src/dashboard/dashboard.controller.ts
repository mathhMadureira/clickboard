import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('summary')
  summary(@Query('date') date?: string, @Query('accountId') accountId?: string) {
    const d = date ?? new Date(Date.now() - new Date().getTimezoneOffset()*60000)
      .toISOString().slice(0,10);
    return this.svc.getSummary(d, accountId);
  }
}
