import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response, Request } from 'express';
import { QueryFailedError } from "typeorm";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 500;
        let message = '服务器内部错误';
        let code = 5000;
        let haveData = false;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
            if (typeof (exception as any).code === 'number') {
                code = (exception as any).code;
            }
            if (typeof (exception as any).data !== 'undefined') {
                haveData = true;
            }

            // auth
            if (status === 401) {
                message = '登录凭证无效';
            }
        } else {
            Logger.error(exception);
        }

        if (exception instanceof QueryFailedError) {
            const queryMessage = exception.message.toLowerCase();

            const defaultMessages = {
                phone: '该手机号已被注册',
            }

            const messages = { ...defaultMessages };
            let isMatch = false;
            if (queryMessage.includes('unique') || queryMessage.includes('duplicate')) {
                // 检查具体是哪个字段冲突
                for (const [field, msg] of Object.entries(messages)) {
                    if (queryMessage.includes(field)) {
                        message = msg;
                        isMatch = true;
                    }
                }

                if (!isMatch) {
                    message = '数据重复，请修改输入信息'
                }
            }
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            code: code,
            ...haveData ? {
                data: (exception as any).data
            } : {}
        });
    }
}