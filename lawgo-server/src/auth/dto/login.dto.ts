import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class LoginBaseDto {
    @IsString()
    @Length(11, 11, { message: '手机号长度不合法' })
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号不合法' })
    phone: string;
}

export class LoginWithPasswordDto extends LoginBaseDto {
    @IsString()
    @Length(6, 20, { message: '密码长度必须在6-20位之间' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/, { message: '密码必须包含字母和数字，长度6-20位' })
    password: string;
}

export class LoginWithCodeDto extends LoginBaseDto {
    @IsString()
    @Length(6, 6, { message: '验证码不合法' })
    @Matches(/^\d+$/, { message: '验证码不合法' })
    code: string;
}