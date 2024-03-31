/**
 * @file Global backend service providing unspecific tasks.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Trail Backend`;
  }
}
