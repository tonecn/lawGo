import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('/admin/user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Role(UserRole.ADMIN)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get()
    async list() {
        return this.userService.list();
    }

    @Get('/:id')
    async get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return this.userService.findByID(id);
    }

    @Post()
    async create(@Body() dto: CreateDto) {
        const { phone, username, password, roles } = dto;
        // 判断手机号是否重复或存在
        const exsitedUser = await this.userService.findByPhone(phone);
        if (exsitedUser) {
            throw new BusinessException({ message: '当前手机号被已注册' });
        }

        // 创建
        const createOptions: {
            phone: string;
            username?: string;
            salt?: string;
            passwordHash?: string
            roles?: UserRole[];
        } = {
            phone,
        };

        if (username) {
            createOptions.username = username;
        }

        if (password) {
            const salt = this.userService.generateSalt();
            const passwordHash = this.userService.hashPassword(password, salt);

            createOptions.salt = salt;
            createOptions.passwordHash = passwordHash;
        }

        if (roles) {
            createOptions.roles = roles;
        }

        return this.userService.create(createOptions);
    }

    @Put('/:id')
    async update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: UpdateDto,
    ) {
        const exsitedUser = await this.userService.findByID(id);
        if (!exsitedUser) {
            throw new BusinessException({ message: '用户不存在' });
        }

        const { phone, username, password, roles } = dto;
        const updateData: Partial<User> = {};
        if (phone) {
            // 通过数据库的唯一索引解决重复的问题
            updateData.phone = phone;
        }

        if (username) {
            updateData.username = username;
        }

        if (password) {
            const salt = this.userService.generateSalt();
            const passwordHash = this.userService.hashPassword(password, salt);

            updateData.salt = salt;
            updateData.passwordHash = passwordHash;
        }

        if (roles) {
            updateData.roles = roles;
        }

        // 写入
        const updateRes = await this.userService.update(id, updateData);
        if (!updateRes.affected) {
            throw new Error('未进行任何修改');
        }
    }

    @Delete('/:id')
    async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        const delRes = await this.userService.delete(id);
        if (!delRes.affected) {
            throw new Error('未删除任何用户');
        }

        // who care??
        // if (delRes.affected !== 1) {
        //     throw new Error('数据异常')
        // }
    }
}
