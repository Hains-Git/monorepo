import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StandaloneDataController } from './standalone-data/standalone-data.controller';

@Module({
  imports: [],
  controllers: [AppController, StandaloneDataController],
  providers: [AppService],
})
export class AppModule {}
