import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    private readonly VerificationCodesMaxTryCount = 5;
    private readonly VerificationCodesExpiredMS = 1000 * 60 * 10;
    private readonly VerificationCodesCoolingMS = 1000 * 60;
    private log = new Logger(AuthService.name);

    private verificationCodesPool: {
        [phone: string]: {
            code: string;
            createdAt: number;// ms时间戳
            tryCount: number;
        }
    } = {}

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * 
     * @returns 0 发送成功；-1 冷却中；-2 未知错误
     */
    async sendSms(phone: string): Promise<0 | -1 | -2> {
        const now = Date.now();
        // 检查是否正在冷却中
        const codeItem = this.verificationCodesPool[phone];
        if (codeItem && now - codeItem.createdAt < this.VerificationCodesCoolingMS) {
            return -1;
        }

        // 生成验证码
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 发送验证码
        /** @todo */

        // 存储验证码
        this.verificationCodesPool[phone] = {
            code,
            createdAt: now,
            tryCount: 0
        };

        this.log.log(`SMS verification code sent to [${phone}] -> [${code}]`);
        return 0;
    }

    /**
     * 
     * @returns 0 验证通过；-1 无效或已过期；-2 验证码错误；-3 超过最大尝试次数
     */
    checkSms(phone: string, code: string) {
        const now = Date.now();

        // 项不存在，即无效或过期
        const codeItem = this.verificationCodesPool[phone];
        if (!codeItem) {
            return -1;
        }

        // 过期
        if (now - codeItem.createdAt > this.VerificationCodesExpiredMS) {
            delete this.verificationCodesPool[phone];
            return -1;
        }

        // 超过最大尝试次数
        if (codeItem.tryCount > this.VerificationCodesMaxTryCount) {
            return -1;// 此处当作无效处理
        }

        // 验证码不匹配
        if (codeItem.code !== code) {
            codeItem.tryCount++;
            if (codeItem.tryCount > this.VerificationCodesMaxTryCount) {
                return -3;// 超过最大尝试次数
            }

            return -2;
        }

        delete this.verificationCodesPool[phone];
        return 0;
    }

    async validateUserByPassword(phone: string, password: string): Promise<User | null> {
        const user = await this.userService.findByPhone(phone, { needPassword: true });

        if (!user) {
            return null;
        }

        const isPasswordValid = this.userService.comparePassword(user, password);

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async generateToken(user: User) {
        const payload = {
            userId: user.id,
        }

        return this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    }

    public async verifyToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
        })
    }
}
