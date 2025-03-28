import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const reqTime = new Date().getTime();
    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();
      if (statusCode === 201 || statusCode === 200) {
        // const blueColor = '\x1b[34m';
        // const redColor = '\x1b[31m';
        const yellowColor = '\x1b[33m';
        const magentaColor = '\x1b[35m';
        const resetColor = '\x1b[32m'; // Green
        const logMessage = `[${method}: ${statusCode}]: ${magentaColor}${originalUrl}${resetColor} - ${yellowColor}${
          resTime - reqTime
        }ms${resetColor}`;
        this.logger.log(logMessage);
      }
    });
    next();
  }
}
