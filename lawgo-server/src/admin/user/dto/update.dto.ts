import { IsArray, IsOptional, IsString, Length, Matches } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class UpdateDto {
    @IsOptional()
    @IsString()
    @Length(11, 11, { message: '手机号长度不合法' })
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号不合法' })
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(1, 20, { message: '用户名长度必须在1~20位之间' })
    username?: string;

    @IsOptional()
    @IsString()
    @Length(6, 20, { message: '密码长度必须在6-20位之间' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/, { message: '密码必须包含字母和数字，长度6-20位' })
    password?: string;


    @IsOptional()
    @IsArray()
    roles?: UserRole[]
}

