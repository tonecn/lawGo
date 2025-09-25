import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { LoginWithCodeDto, LoginWithPasswordDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { AuthError } from './auto.error';
import { CommonError } from 'src/common/errors/common.error';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('sms-code')
    async sendSms(@Body() sendSmsDto: SendSmsDto) {
        const res = await this.authService.sendSms(sendSmsDto.phone);
        switch (res) {
            case 0:
                break;
            case -1:
                throw new BusinessException(AuthError.CAPTCHA_COOLDOWN);
            case -2:
            default:
                throw new BusinessException(CommonError.UNKNOWN);
        }

        return;
    }

    @Post('login')
    async login(@Body() dto: LoginWithCodeDto) {
        const { phone, code } = dto;
        // 检查验证码是否合法
        const checkRes = this.authService.checkSms(phone, code);
        switch (checkRes) {
            case 0:
                break;
            case -1:
                throw new BusinessException(AuthError.CAPTCHA_INVALID)
            case -2:
                throw new BusinessException(AuthError.CAPTCHA_MISMATCH)
            case -3:
                throw new BusinessException(AuthError.CAPTCHA_MAX_ATTEMPTS)
            default:
                throw new BusinessException(CommonError.UNKNOWN);
        }

        // 检查是否存在
        let user = await this.userService.findByPhone(phone);
        if (!user) {
            let createData: {
                phone: string;
                roles?: UserRole[];
            } = {
                phone: phone,
            };
            // 检查用户数量，若为0则默认该用户为管理员
            const count = await this.userService.count();
            if (count === 0) {
                createData.roles = [UserRole.ADMIN];
            }

            // 注册
            user = await this.userService.create(createData);
        }

        // 签名
        return {
            token: await this.authService.generateToken(user),
        }
    }

    @Post('login-by-password')
    async loginByPassword(@Body() dto: LoginWithPasswordDto) {
        const { phone, password } = dto;
        const user = await this.authService.validateUserByPassword(phone, password);

        if (!user) {
            throw new BusinessException(AuthError.PASSWORD_INCORRECT);
        }

        return {
            token: await this.authService.generateToken(user),
        }
    }
}
