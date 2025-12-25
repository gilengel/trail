/**
 * @file Global backend module that defines all dependencies and modules that are available in this backend.
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { PrismaService } from './prisma.service';
import { ImagesModule } from './images/images.module';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [
    RoutesModule,
    ImagesModule,
    TripsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),
  ],
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
