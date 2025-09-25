import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class TtsDto {
    @IsString()
    @IsNotEmpty({ message: '请求参数错误' })
    @MinLength(1, { message: '请求参数错误' })
    text: string;
}