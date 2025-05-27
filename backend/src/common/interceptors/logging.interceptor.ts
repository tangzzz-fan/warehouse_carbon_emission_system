import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

/**
 * 日志拦截器
 * 记录请求和响应信息
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        const now = Date.now();

        this.logger.log(
            `${method} ${url} - ${ip} - ${userAgent} - 请求开始`,
        );

        return next.handle().pipe(
            tap(() => {
                const responseTime = Date.now() - now;
                this.logger.log(
                    `${method} ${url} - ${ip} - ${userAgent} - 响应时间: ${responseTime}ms`,
                );
            }),
        );
    }
} 