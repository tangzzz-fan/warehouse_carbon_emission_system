import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

/**
 * 响应转换拦截器
 * 统一包装API响应格式
 */
@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
                message: '操作成功',
                timestamp: new Date().toISOString(),
            })),
        );
    }
} 