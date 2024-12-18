import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GlobalAuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  // imports: [AuthModule, PrismaModule],
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [
    AppService
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAuthGuard
    // }
  ]
})
export class AppModule {}
