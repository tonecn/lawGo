import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('me')
    async me(@Req() req: Request) {
        const { user } = req;
        return user;
    }

    @Put('profile')
    async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
        const { user } = req as { user: User };
        if (!user || !user.id) {
            throw new BusinessException({ message: '未知异常' });
        }

        const { username, password } = dto;

        const updateData: Partial<User> = {};
        if (username) {
            updateData.username = username;
        }

        if (password) {
            const salt = this.userService.generateSalt();
            const passwordHash = this.userService.hashPassword(password, salt);
            updateData.salt = salt;
            updateData.passwordHash = passwordHash;
        }

        return (await this.userService.update(user.id, updateData)).affected > 0;

    }
}
