import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (cfg: ConfigService) => ({ secret: cfg.get('JWT_SECRET') })
  })],
  controllers: [AuthController],
  providers: [PrismaService],
})
export class AuthModule {}
