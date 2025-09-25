import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface ResponseData<T> {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
    code: number;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseData<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseData<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        return next.handle().pipe(
            map(data => ({
                statusCode: 200,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: '请求成功',
                code: 0,
                data: data || null,
            })),
        );
    }
}