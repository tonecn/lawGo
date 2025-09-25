import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        if (!payload || typeof payload.userId !== 'string') {
            throw new UnauthorizedException('无效的凭证');
        }

        const user = await this.userService.findByID(payload.userId);
        if (!user) {
            throw new UnauthorizedException('用户不存在');
        }

        return user;
    }
}