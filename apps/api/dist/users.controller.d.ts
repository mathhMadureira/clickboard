import { PrismaService } from './prisma.service';
export declare class UsersController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(q?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }[]>;
}
