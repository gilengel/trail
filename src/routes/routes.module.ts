import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [RoutesService, PrismaService],
  controllers: [RoutesController],
})
export class RoutesModule {}
