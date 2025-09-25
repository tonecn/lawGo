import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SstDto {
    @IsString()
    @IsNotEmpty({ message: '请求参数错误' })
    @MinLength(1, { message: '请求参数错误' })
    audioBase64: string;
}