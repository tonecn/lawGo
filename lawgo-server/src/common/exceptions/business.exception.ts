import { HttpException, HttpStatus } from "@nestjs/common";

export type BusinessError = {
    code?: number;
    message: string;
    data?: any;
}

export class BusinessException extends HttpException {
    readonly code: number;
    readonly data?: any;
    constructor(error: BusinessError) {
        super(error.message, HttpStatus.BAD_REQUEST);
        this.code = error.code;
        this.data = error.data;
    }
}