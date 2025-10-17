import { PrismaService } from './prisma.service';
export declare class OrdersController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(accountId?: string, dateStr?: string, status?: 'PENDING' | 'APPROVED' | 'REFUNDED'): Promise<({
        account: {
            id: string;
            platform: string;
        };
    } & {
        id: string;
        accountId: string;
        amountNet: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        occurredAt: Date;
    })[]>;
}
