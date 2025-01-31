import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GlobalAuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

import { AbwesenheitenController } from './abwesenheiten/abwesenheiten.controller';
import { AbwesenheitenService } from './abwesenheiten/abwesenheiten.service';

@Module({
  // imports: [AuthModule, PrismaModule],
  imports: [PrismaModule],
  controllers: [AppController, AbwesenheitenController],
  providers: [
    AppService,
    AbwesenheitenService
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAuthGuard
    // }
  ]
})
export class AppModule {}
