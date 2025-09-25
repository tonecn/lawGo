import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { AichatService } from 'src/aichat/aichat.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UpdateIndexDto } from './dto/update-index.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('/admin/chat')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Role(UserRole.ADMIN)
export class ChatController {

    constructor(
        private readonly chatService: AichatService,
        private readonly userService: UserService,
    ) { }

    @Get('index')
    async listIndex() {
        const indexs = await this.chatService.listAllChatIndex();
        const userIds = Array.from(new Set(indexs.map(i => i.userId)));
        // 根据userIds查询用户信息
        const users: User[] = []
        for (const userId of userIds) {
            const u = await this.userService.findByID(userId);
            if (u) {
                users.push(u);
            }
        }

        return {
            indexs,
            users,
        }
    }

    @Get('index/:id')
    async getIndex(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return {
            index: await this.chatService.findChatIndexById(id),
        }
    }

    @Put('index/:id')
    async updateIndex(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: UpdateIndexDto,
    ) {
        return (await this.chatService.updateChatIndex(id, { title: dto.title })).affected > 0
    }

    @Delete('index/:id')
    async deleteIndex(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return (await this.chatService.deleteChatIndex(id)).affected > 0;
    }

    @Get('history/:id')
    async getChatHistory(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return {
            history: await this.chatService.getChatHistory(id, true),
        }
    }
}
