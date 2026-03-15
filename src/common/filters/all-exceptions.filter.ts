import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const body: any = res;
        message = body.message ?? message;
        errors = body?.errors ?? [];
      }
    } else if (exception instanceof MongoError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      if ((exception as any).code === 11000) {
        message = 'Duplicate key error';
      }
    }

    this.logger.error({
      message: exception instanceof Error ? exception.message : exception,
      stack: exception instanceof Error ? exception.stack : undefined,
      path: request.url,
      method: request.method,
      status,
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp,
      path: request.url,
    });
  }
}
