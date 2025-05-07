import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './_modules//auth/auth.module';
import { FileUploadModule } from './_modules/file-upload/file-upload.module';
import { PrismaModule } from './_modules/prisma/prisma.module';
import { UserModule } from './user/user.module';
// import { GlobalAuthGuard } from './guards/auth.guard';
// import { APP_GUARD } from '@nestjs/core';

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
import { FileStreamModule } from './_modules/file-stream/file-stream.module';
import { LoggerMiddleware } from './middlewares/logger-middleware';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RotationController } from './rotationen/rotation.controller';
import { RotationService } from './rotationen/rotation.service';
import { TelefonController } from './telefon/telefon.controller';
import { TelefonService } from './telefon/telefon.service';

@Module({
  // imports: [AuthModule, PrismaModule],
  imports: [PrismaModule, FileUploadModule, FileStreamModule, UserModule],
  controllers: [
    AppController,
    MetricsController,
    AbwesenheitenController,
    MitarbeiterInfoController,
    TeamController,
    FraunhoferController,
    ZeitraumkategorienController,
    RotationController,
    TelefonController
  ],
  providers: [
    Logger,
    AppService,
    MetricsService,
    AbwesenheitenService,
    MitarbeiterInfoService,
    TeamService,
    FraunhoferService,
    ZeitraumkategorienService,
    RotationService,
    TelefonService
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAuthGuard
    // }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // exclude can have a list as params like ('/metrics', '/health')
    // Or the Controller it self
    consumer.apply(LoggerMiddleware).exclude('/metrics', '/fraunhofer').forRoutes('*');
  }
}
