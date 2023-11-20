import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        // We ignore handling HttpExceptions raised by controllers as it is expected that
        // these are already correct and can be send to the client without additional care
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        return throwError(() => new BadRequestException());
      }),
    );
  }
}
