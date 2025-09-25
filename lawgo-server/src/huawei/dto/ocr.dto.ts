import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class OcrDto {
    @IsString()
    @IsNotEmpty({ message: '请求参数错误' })
    @MinLength(1, { message: '请求参数错误' })
    imageBase64: string;
}