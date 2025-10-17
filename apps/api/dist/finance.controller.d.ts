import { PrismaService } from './prisma.service';
export declare class FinanceController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    adspend(accountId?: string, dateStr?: string): Promise<({
        account: {
            id: string;
            platform: string;
        } | null;
    } & {
        id: string;
        accountId: string | null;
        date: Date;
        amount: number;
    })[]>;
    expenses(accountId?: string, dateStr?: string): Promise<({
        account: {
            id: string;
            platform: string;
        } | null;
    } & {
        id: string;
        accountId: string | null;
        date: Date;
        amount: number;
        note: string | null;
    })[]>;
}
