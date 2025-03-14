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
import { ZeitraumkategorienController } from './zeitraumkategorien/zeitraumkategorien.controller';
import { ZeitraumkategorienService } from './zeitraumkategorien/zeitraumkategorien.service';
import { MetricsService } from './metrics/metrics.service';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  // imports: [AuthModule, PrismaModule],
  imports: [PrismaModule],
  controllers: [
    AppController,
    MetricsController,
    AbwesenheitenController,
    MitarbeiterInfoController,
    TeamController,
    FraunhoferController,
    ZeitraumkategorienController
  ],
  providers: [
    AppService,
    MetricsService,
    AbwesenheitenService,
    MitarbeiterInfoService,
    TeamService,
    FraunhoferService,
    ZeitraumkategorienService
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAuthGuard
    // }
  ]
})
export class AppModule {}
