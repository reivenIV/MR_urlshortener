import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// export it so other modules can inject it
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
