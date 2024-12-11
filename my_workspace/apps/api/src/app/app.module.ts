import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StandaloneDataController } from './standalone-data/standalone-data.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AppController, StandaloneDataController],
  providers: [AppService]
})
export class AppModule {}
