import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
export declare class AuthController {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
