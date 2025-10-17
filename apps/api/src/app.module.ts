import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { AccountsController } from './accounts.controller';
import { OrdersController } from './orders.controller';
import { FinanceController } from './finance.controller';
import { UsersController } from './users.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    // Torna ConfigService disponível globalmente (JwtModule precisa dele)
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DashboardModule,
  ],
  controllers: [
    AppController,
    AccountsController,
    OrdersController,
    FinanceController,
    UsersController,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
