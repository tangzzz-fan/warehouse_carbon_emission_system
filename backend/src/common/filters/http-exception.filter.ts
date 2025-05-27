import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HTTP异常过滤器
 * 统一处理HTTP异常，返回标准化的错误响应
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();
        const error =
            typeof exceptionResponse === 'string'
                ? { message: exceptionResponse }
                : (exceptionResponse as object);

        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            ...error,
        };

        // 记录错误日志
        this.logger.error(
            `HTTP Exception: ${request.method} ${request.url}`,
            JSON.stringify(errorResponse),
        );

        response.status(status).json(errorResponse);
    }
} 