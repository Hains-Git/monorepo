import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let errorDetails: string | object = {
      error: 'Internal Server Error',
      message: ['Something went wrong'],
      statusCode: status
    };
    if (exception instanceof HttpException) {
      status = exception.getStatus() || 500;
      errorDetails = exception.getResponse();
    }

    this.logger.error(
      `[${request.method}]: ${request.originalUrl} [status]: ${status} [error]: ${exception.message}`
    );

    response.status(status).json({
      error: true,
      errorDetails
    });
  }
}
