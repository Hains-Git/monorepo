import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes the module global
@Module({
  providers: [PrismaService],
  exports: [PrismaService] // Export the service so it can be used in other modules
})
export class PrismaModule {}
