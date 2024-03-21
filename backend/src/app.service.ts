/**
 * @file Global backend service providing unspecific tasks.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ` 
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World! Site Title</title>
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>    
    `;
  }
}
