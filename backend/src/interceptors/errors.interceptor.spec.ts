/**
 * @file Provides functionality to create, read, update and delete images.
 */
import { throwError, lastValueFrom } from 'rxjs';
import { ErrorsInterceptor } from './errors.interceptor';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('ErrorsInterceptor', () => {
  let interceptor: ErrorsInterceptor;

  beforeEach(() => {
    interceptor = new ErrorsInterceptor();
  });

  it('should intercept an error that is not of type HttpException and transform them into a "BadRequest" ', async () => {
    const context = createMock<ExecutionContext>();
    const handler = createMock<CallHandler>({
      handle: () => throwError(() => new Error()),
    });

    const userObservable = interceptor.intercept(context, handler);
    await expect(lastValueFrom(userObservable)).rejects.toThrow(
      new BadRequestException(),
    );
  });

  it('should do nothing if an error is of type HttpException', async () => {
    const context = createMock<ExecutionContext>();
    const handler = createMock<CallHandler>({
      handle: () =>
        throwError(() => new HttpException('', HttpStatus.FORBIDDEN)),
    });

    const userObservable = interceptor.intercept(context, handler);
    await expect(lastValueFrom(userObservable)).rejects.toThrow(
      new HttpException('', HttpStatus.FORBIDDEN),
    );
  });
});
