import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { PrismaService } from './prisma.service';
import { ImagesModule } from './images/images.module';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [RoutesModule, ImagesModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
