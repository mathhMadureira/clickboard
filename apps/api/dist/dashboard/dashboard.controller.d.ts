import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly svc;
    constructor(svc: DashboardService);
    summary(date?: string, accountId?: string): Promise<{
        period: string;
        faturamento: number;
        gastosAds: number;
        despesas: number;
        lucro: number;
        roas: number | null;
        pendentes: number;
        reembolsadas: number;
    }>;
}
