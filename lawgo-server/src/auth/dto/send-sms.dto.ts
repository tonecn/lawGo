import { IsString, Length, Matches } from 'class-validator';

export class SendSmsDto {
    @IsString()
    @Length(11, 11, { message: '手机号长度不合法' })
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号不合法' })
    phone: string;
}