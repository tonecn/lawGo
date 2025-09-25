import { reactive, ref } from "vue"
import type { ChatIndex } from "../types/ChatIndex"
import { AichatAPI } from "../api"
import type { ChatContent } from "../types/ChatContent"

export class AichatVM {

    public data: {
        chatIndexs: {
            [indexId: string]: ChatIndex
        }
        chatHistorys: {
            [indexId: string]: ChatContent[]
        },
        currentIndexId: string | null;
    } = reactive({
        chatIndexs: {},
        chatHistorys: {},
        currentIndexId: null,
    })

    constructor() {

    }

    /** @returens indexId */
    async initChat(options?: {
        initHistory: ChatContent[],
    }) {
        try {
            const initialRes = await AichatAPI.initChat();
            if (!initialRes.id) {
                throw new Error('未知异常');
            }

            this.data.chatIndexs[initialRes.id] = initialRes;// 加入对话索引
            this.data.currentIndexId = initialRes.id;// 调整对话指针指向
            this.data.chatHistorys[initialRes.id] = options?.initHistory ?? [];// 初始化对话记录结构
            return initialRes.id;
        } catch (error: any) {
            throw new error;
        }
    }

    async chat(indexId: string, content: string) {
        const chatHistory = this.data.chatHistorys[indexId];
        if (!chatHistory) {
            throw new Error('对话不存在');
        }

        // 加入用户输入到到对话
        chatHistory.push({
            id: `${Date.now()}`,
            content: content,
            role: 'user',
            createdAt: new Date(),
        });

        // 加入AI响应
        const aiResponseChatItem = ref<ChatContent>({
            id: `${Date.now()}`,
            content: '',
            role: 'assistant',
            createdAt: new Date(),
        });
        chatHistory.push(aiResponseChatItem.value);

        // 发送对话请求
        await AichatAPI.chat(
            indexId,
            content,
            {
                onData: (chunk) => {
                    aiResponseChatItem.value.content += chunk;
                },
                onComplete: () => { },
                onError: () => { },
            }
        ).catch(e => {
            throw new e;
        });
    }

    async updateChatIndexTitle(indexId: string, title: string) {
        return await AichatAPI.updateChatIndexTitle(indexId, title).then(() => {
            if (this.data.chatIndexs[indexId]) {
                this.data.chatIndexs[indexId].title = title;
            }
        });
    }

    async loadChatHistory(indexId: string) {
        const history = await AichatAPI.getChatHistory(indexId);
        this.data.chatHistorys[indexId] = history.map(h => {
            h.createdAt = new Date(h.createdAt);
            return h;
        }).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async loadChatIndexs() {
        const indexs = await AichatAPI.listChatIndexs();
        indexs.forEach(i => {
            this.data.chatIndexs[i.id] = i;
        })
    }

    setCurrentIndexId(indexId: string | null) {
        this.data.currentIndexId = indexId;
    }
}