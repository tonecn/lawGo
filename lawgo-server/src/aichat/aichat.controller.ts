import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Post, Put, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AichatService } from './aichat.service';
import { Response } from 'express';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { CommonError } from 'src/common/errors/common.error';
import { AuthGuard } from '@nestjs/passport';
import { StreamChatDto } from './dto/stream-chat.dto';
import { UpdateChatIndexTitleDto } from './dto/update-chat-index-title.dto';
import { StreamChatNoContextDto } from './dto/stream-chat-no-context.dto';

@Controller('aichat')
@UseGuards(AuthGuard('jwt'))
export class AichatController {

    private readonly log = new Logger(AichatController.name);

    constructor(
        private readonly aichatService: AichatService,
    ) { }

    @Post('init')
    async initStreamChat(@Req() req) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        return this.aichatService.initStreamChat(user.id);
    }

    @Post()
    async streamChat(@Req() req, @Res() res: Response, @Body() dto: StreamChatDto) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        const chatResponse = await this.aichatService.create({
            userId: user.id,
            content: dto.content,
            indexId: dto.indexId,
        });

        if (!chatResponse.success) {
            throw new BusinessException({ message: '初始化失败，请刷新重试' });
        }

        try {
            res.setHeader('Content-type', 'text/plain');
            res.setHeader('Transfer-Encoding', 'chunked');

            chatResponse.stream.pipe(res);

            chatResponse.stream.on('end', () => { });
            chatResponse.stream.on('error', (e) => {
                this.log.error(`stream error:`, e);
            })

        } catch (error) {
            this.log.error(`failed to start stream:`, error);
        }
    }

    @Post('no-context')
    async streamChatWithNoContext(@Req() req, @Res() res: Response, @Body() dto: StreamChatNoContextDto) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        const stream = await this.aichatService.createStream(dto.messages);

        try {
            res.setHeader('Content-type', 'text/plain');
            res.setHeader('Transfer-Encoding', 'chunked');

            stream.pipe(res);

            stream.on('end', () => { });
            stream.on('error', (e) => {
                this.log.error(`stream error:`, e);
            })

        } catch (error) {
            this.log.error(`failed to start stream:`, error);
        }
    }

    @Get('index')
    async listIndex(@Req() req) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        return this.aichatService.listChatIndexByUserId(user.id);
    }

    @Get('index/:id')
    async getChatIndex(@Req() req, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        return this.aichatService.findChatIndexByUserIdAndIndexId(user.id, id);
    }

    @Put('index/:id')
    async updateChatIndexTitle(
        @Req() req,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: UpdateChatIndexTitleDto,
    ) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        const chatIndex = await this.aichatService.findChatIndexByUserIdAndIndexId(user.id, id);
        if (!chatIndex) {
            throw new BusinessException(CommonError.UNKNOWN);
        }

        const updateRes = await this.aichatService.updateChatIndex(id, {
            title: dto.title,
        });

        return updateRes.affected > 0;
    }

    @Delete('index/:id')
    async deleteChatIndex(
        @Req() req,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        const chatIndex = await this.aichatService.findChatIndexByUserIdAndIndexId(user.id, id);
        if (!chatIndex) {
            throw new BusinessException({ message: '不存在的索引' });
        }

        return (await this.aichatService.deleteChatIndex(id)).affected > 0;
    }

    @Get('history/:id')
    async getChatHistory(@Req() req, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        const { user } = req;
        if (!user || !user.id) {
            throw new UnauthorizedException();
        }

        const index = await this.aichatService.findChatIndexByUserIdAndIndexId(user.id, id);
        if (!index) {
            throw new BusinessException({ message: '对话不存在' });
        }

        return this.aichatService.getChatHistory(id);
    }
}
