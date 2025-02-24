import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GlobalAuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

import { AbwesenheitenController } from './abwesenheiten/abwesenheiten.controller';
import { AbwesenheitenService } from './abwesenheiten/abwesenheiten.service';
import { FraunhoferController } from './fraunhofer/fraunhofer.controller';
import { FraunhoferService } from './fraunhofer/fraunhofer.service';
import { MitarbeiterInfoController } from './mitarbeiterinfo/mitarbeiterinfo.controller';
import { MitarbeiterInfoService } from './mitarbeiterinfo/mitarbeiterinfo.service';
import { TeamService } from './team/team.service';
import { TeamController } from './team/team.controller';

@Module({
  // imports: [AuthModule, PrismaModule],
  imports: [PrismaModule],
  controllers: [
    AppController,
    AbwesenheitenController,
    MitarbeiterInfoController,
    TeamController,
    FraunhoferController
  ],
  providers: [
    AppService,
    AbwesenheitenService,
    MitarbeiterInfoService,
    TeamService,
    FraunhoferService
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAuthGuard
    // }
  ]
})
export class AppModule {}
