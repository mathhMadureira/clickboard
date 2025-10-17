export declare class DashboardService {
    getSummary(date: string, accountId?: string): Promise<{
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
