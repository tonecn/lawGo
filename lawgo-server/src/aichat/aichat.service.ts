import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { Readable } from 'stream';
import { AichatIndex } from './entities/aichat-index.entity';
import { Repository } from 'typeorm';
import { AiChatHistory } from './entities/aichat-history.entity';

@Injectable()
export class AichatService {

    private log = new Logger(AichatService.name);

    private openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
    })

    constructor(
        @InjectRepository(AichatIndex)
        private readonly aichatIndexRepository: Repository<AichatIndex>,
        @InjectRepository(AiChatHistory)
        private readonly aichatHistoryRepository: Repository<AiChatHistory>,
    ) { }

    async initStreamChat(userId: string) {
        // 创建新的对话
        let historyIndex = this.aichatIndexRepository.create();
        historyIndex.userId = userId;
        historyIndex = await this.aichatIndexRepository.save(historyIndex);

        // 初始化历史记录
        await this.aichatHistoryRepository.insert([
            {
                indexID: historyIndex.id,
                role: 'system',
                content: '你是一个法律助手，请提供专业的法律建议。',
                isHidden: true,
            }
        ]);

        await new Promise(resolve => setTimeout(resolve, 10));

        await this.aichatHistoryRepository.insert({
            indexID: historyIndex.id,
            role: 'assistant',
            content: '您好，我是你的专属智能法律顾问，你希望我帮你解决什么问题？',
        });

        return historyIndex;
    }

    async findChatIndexByUserIdAndIndexId(userId: string, indexId: string) {
        return this.aichatIndexRepository.findOne({
            where: {
                id: indexId,
                userId: userId,
            }
        })
    }

    async findChatIndexById(id: string) {
        return this.aichatIndexRepository.findOne({ where: { id } })
    }

    async updateChatIndex(id: string, updateData?: {
        title?: string;
    }) {
        const { title } = updateData ?? {};
        return this.aichatIndexRepository.update(id, {
            ...title ? {
                title: title,
            } : {},
        })
    }

    async deleteChatIndex(id: string) {
        return this.aichatIndexRepository.softDelete(id);
    }

    async listChatIndexByUserId(userId: string) {
        return this.aichatIndexRepository.find({
            where: {
                userId: userId,
            },
            order: {
                updatedAt: 'DESC',
            }
        })
    }


    async create(options: { userId: string, content: string, indexId: string }): Promise<{
        success: boolean,
        indexID?: string,
        stream?: Readable,
    }> {
        let chatHistoryIndex = await this.aichatIndexRepository.findOne({
            where: {
                id: options.indexId,
            }
        });

        if (!chatHistoryIndex) {
            // 传入了不存在或错误的indexID
            return {
                success: false,
            }
        }

        // 写入当前传入的
        await this.aichatHistoryRepository.insert({
            content: options.content,
            indexID: chatHistoryIndex.id,
            role: 'user',
        })

        // 读取所有的历史对话
        const chatHistorys = await this.aichatHistoryRepository.find({
            where: {
                indexID: chatHistoryIndex.id,
            },
            order: {
                createdAt: 'ASC',
            }
        });

        const stream = await this.createStream(chatHistorys.map(c => ({
            role: c.role,
            content: c.content,
        })));

        let assistantContent = '';
        stream.on('data', (chunk) => {
            assistantContent += chunk.toString();
        })

        stream.on('end', async () => {
            // 存储AI生成的内容
            if (assistantContent) {
                try {
                    await this.aichatHistoryRepository.insert({
                        content: assistantContent,
                        indexID: chatHistoryIndex.id,
                        role: 'assistant',
                    })
                    await this.updateChatIndex(chatHistoryIndex.id);
                } catch (error) {
                    this.log.error(`Failed to save assistant response: `, error);
                }
            };
        })

        return {
            success: true,
            indexID: chatHistoryIndex.id,
            stream: stream,
        }
    }

    async createStream(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
        const completion = await this.openai.chat.completions.create({
            messages: [...messages],
            model: 'deepseek-chat',
            stream: true,
        });

        const stream = new Readable({
            read() { },
            objectMode: false,
        });

        (async () => {
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        stream.push(content);
                    }
                }
                stream.push(null);
            } catch (error) {
                stream.destroy(error);
            }
        })();

        return stream;
    }

    async getChatHistory(indexId: string, withHidden?: boolean) {
        return this.aichatHistoryRepository.find({
            where: {
                indexID: indexId,
                ...withHidden ? {} : { isHidden: false },
            },
            order: {
                createdAt: 'asc'
            }
        })
    }

    async listAllChatIndex() {
        return this.aichatIndexRepository.find();
    }
}
