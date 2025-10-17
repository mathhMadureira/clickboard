import { PrismaService } from './prisma.service';
export declare class AccountsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(q?: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        platform: string;
        userId: string;
        createdAt: Date;
    })[]>;
}
