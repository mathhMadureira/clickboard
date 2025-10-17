import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getSummary(date: string, accountId?: string) {
    // MOCK provisório — troque pelos dados reais depois
    const faturamento = 12345.67;
    const gastosAds   = 2345.67;
    const despesas    = 1000.00;
    const lucro       = faturamento - (gastosAds + despesas);

    return {
      period: date,
      faturamento,
      gastosAds,
      despesas,
      lucro,
      roas: gastosAds > 0 ? faturamento / gastosAds : null,
      pendentes: 3,
      reembolsadas: 1,
    };
  }
}
