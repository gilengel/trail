import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, PrismaService],
})
export class RoutesModule {}
